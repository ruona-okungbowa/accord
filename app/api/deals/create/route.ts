import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

    // Validate file if provided
    if (file) {
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
    }

    const newDeal = {
      name,
      description: description || null,
      currency,
      role,
      target_signing_date: targetSigningDate || null,
      created_by: user.id,
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

    const safeName = (file.name || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}_${safeName}`;
    const filePath = `${user.id}/documents/${filename}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return NextResponse.json(
      {
        message: "Deal created successfully",
        deal: deal,
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
