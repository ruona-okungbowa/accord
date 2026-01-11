import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { DraftProposal } from "@/lib/types/proposals";

/**
 * GET /api/proposals?dealId=xxx
 * List all proposals for a deal
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get("dealId");

    if (!dealId) {
      return NextResponse.json(
        { error: "dealId query parameter is required" },
        { status: 400 }
      );
    }

    // Fetch proposals for the deal
    const { data: proposals, error } = await supabase
      .from("proposals")
      .select(
        `
        *,
        author:proposed_by(id, first_name, last_name, firm_name),
        reviewer:reviewed_by(id, first_name, last_name),
        proposal_edits(*)
      `
      )
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching proposals:", error);
      return NextResponse.json(
        { error: "Error fetching proposals" },
        { status: 500 }
      );
    }

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error("GET proposals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/proposals
 * Create a new proposal
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      dealId,
      documentId,
      title,
      summary,
      edits,
      status = "draft",
    }: {
      dealId: string;
      documentId: string;
      title: string;
      summary?: string;
      edits: DraftProposal["edits"];
      status?: string;
    } = body;

    if (!dealId || !documentId || !title || !edits || edits.length === 0) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: dealId, documentId, title, and edits are required",
        },
        { status: 400 }
      );
    }

    // Create the proposal
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .insert({
        deal_id: dealId,
        document_id: documentId,
        title,
        summary,
        status,
        proposed_by: user.id,
        submitted_at: status === "submitted" ? new Date().toISOString() : null,
        issue_id: null, // Standalone proposal
        proposed_text: "", // Keep for compatibility, actual text is in edits
      })
      .select()
      .single();

    if (proposalError || !proposal) {
      console.error("Error creating proposal:", proposalError);
      return NextResponse.json(
        { error: "Error creating proposal" },
        { status: 500 }
      );
    }

    // Create the edits
    const editsToInsert = edits.map((edit, index) => ({
      proposal_id: proposal.id,
      section_id: edit.section_id,
      action: edit.action,
      original_text: edit.original_text,
      proposed_text: edit.proposed_text,
      position_start: edit.position_start,
      position_end: edit.position_end,
      rationale: edit.rationale,
      category: edit.category,
      order: index,
    }));

    const { error: editsError } = await supabase
      .from("proposal_edits")
      .insert(editsToInsert);

    if (editsError) {
      console.error("Error creating edits:", editsError);
      // Rollback: delete the proposal
      await supabase.from("proposals").delete().eq("id", proposal.id);
      return NextResponse.json(
        { error: "Error creating proposal edits" },
        { status: 500 }
      );
    }

    // Fetch the complete proposal with edits
    const { data: completeProposal } = await supabase
      .from("proposals")
      .select(
        `
        *,
        author:proposed_by(id, first_name, last_name, firm_name),
        proposal_edits(*)
      `
      )
      .eq("id", proposal.id)
      .single();

    return NextResponse.json(
      {
        message: "Proposal created successfully",
        proposal: completeProposal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST proposals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
