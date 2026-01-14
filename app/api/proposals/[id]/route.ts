import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Update proposal status (approve/reject)
 * PATCH /api/proposals/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, review_notes } = body;

    if (!status || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Verify user is arranger_counsel
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .select(
        "id, deal_id, document_id, section_id, proposed_text, title, summary"
      )
      .eq("id", id)
      .single();

    if (!proposal || proposalError) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const { data: participant } = await supabase
      .from("deal_participants")
      .select("role")
      .eq("deal_id", proposal.deal_id)
      .eq("user_id", user.id)
      .single();

    if (!participant || participant.role !== "arranger_counsel") {
      return NextResponse.json(
        { error: "Only arranger counsel can review proposals" },
        { status: 403 }
      );
    }

    const { data: updated, error } = await supabase
      .from("proposals")
      .update({
        status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_comments: review_notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (status === "accepted") {
      // If approved, update the relevant document section with the proposed text
      const { data: docRow, error: docError } = await supabase
        .from("documents")
        .select("id,content")
        .eq("id", proposal.document_id)
        .single();

      if (docError || !docRow) {
        throw docError || new Error("Document not found");
      }
      const structured = docRow.content as any;
      if (!structured?.sections || !Array.isArray(structured.sections)) {
        throw new Error("Invalid document structure");
      }
      const updatedSections = structured.sections.map((section: any) => {
        if (section.id === proposal.section_id) {
          return {
            ...section,
            content: proposal.proposed_text,
            metadata: {
              ...(section.metadata ?? {}),
              lastEditedBy: user.id,
              lastEditedAt: new Date().toISOString(),
              source: "proposal_accepted",
              proposalId: proposal.id,
            },
          };
        }
        return section;
      });

      const nextDoc = { ...structured, sections: updatedSections };
      const { data: updatedDoc, error: updateDocError } = await supabase
        .from("documents")
        .update({ content: nextDoc, updated_at: new Date().toISOString() })
        .eq("id", proposal.document_id)
        .select()
        .single();

      if (updateDocError) throw updateDocError;
    }

    return NextResponse.json({ proposal: updated });
  } catch (error) {
    console.error("PATCH proposal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
