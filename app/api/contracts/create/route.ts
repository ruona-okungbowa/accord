import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/document-extractor";
import { structureDocumentText } from "@/lib/document-structurer";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: "Unauthorised user" }, { status: 401 });
    }

    const form = await request.formData();
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const currency = form.get("currency") as string;
    const role = form.get("role") as string;
    const targetSigningDate = form.get("targetSigningDate") as string;
    const file = form.get("document") as File | null;

    // Validate required fields
    if (!name || !currency || !role || !file) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, currency, file and role are required.",
        },
        { status: 400 }
      );
    }

    // Validate file
    const maxSize = 25 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 25MB limit." },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only PDF and DOCX files are supported.",
        },
        { status: 400 }
      );
    }

    // Step 1: Create the deal
    const newDeal = {
      name,
      description: description || null,
      currency,
      target_close_date: targetSigningDate || null,
      created_by: user.id,
      status: "drafting",
    };

    const { data: deal, error: dealError } = await supabase
      .from("deals")
      .insert(newDeal)
      .select()
      .single();

    if (dealError || !deal) {
      console.error("Deal creation error:", dealError);
      return NextResponse.json(
        {
          error: "Failed to create deal.",
        },
        { status: 500 }
      );
    }

    // Step 2: Add deal participant (creator)
    const { error: participantError } = await supabase
      .from("deal_participants")
      .insert({
        deal_id: deal.id,
        user_id: user.id,
        role: role,
        invited_by: null, // Creator has no inviter
        accepted_at: new Date().toISOString(),
        is_active: true,
      });

    if (participantError) {
      console.error("Participant creation error:", participantError);
      // Rollback deal creation would be ideal here, but continue for now
    }

    // Step 3: Extract and structure document text
    let structuredContent = null;
    let storagePath = null;

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Extract text from document
      const rawText = await extractTextFromFile(buffer, file.type);

      // Structure the text for redlining
      const structuredDoc = structureDocumentText(
        rawText,
        file.name,
        file.type
      );

      structuredContent = structuredDoc;

      // Step 4: Upload file to Supabase storage
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${Date.now()}_${safeName}`;
      const filePath = `${user.id}/deals/${deal.id}/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        // Continue even if upload fails - we have the text extracted
      } else {
        storagePath = filePath;
      }
    } catch (extractError) {
      console.error("Document extraction error:", extractError);
      // Continue - we'll create document record without structured content
    }

    // Step 5: Create document record
    const { data: document, error: docError } = await supabase
      .from("documents")
      .insert({
        title: file.name,
        content: structuredContent,
        created_by: user.id,
        deal_id: deal.id,
      })
      .select()
      .single();

    if (docError) {
      console.error("Document creation error:", docError);
      return NextResponse.json(
        {
          error: "Deal created but document processing failed.",
          deal: deal,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Deal created successfully",
        deal: deal,
        document: document,
        metadata: {
          storagePath,
          sectionsExtracted: structuredContent?.sections?.length || 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in create deals route", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
