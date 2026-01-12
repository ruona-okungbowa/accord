import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import {
  applyProposalEditsToDocument,
  validateProposalEdits,
  createChangeSummary,
} from "@/lib/document/update";
import { ProposalEdit } from "@/lib/types/proposals";

/**
 * GET /api/proposals/[id]
 * Get a specific proposal with all its edits and comments
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: proposal, error } = await supabase
      .from("proposals")
      .select(
        `
        *,
        author:proposed_by(id, first_name, last_name, firm_name),
        reviewer:reviewed_by(id, first_name, last_name),
        proposal_edits(*),
        proposal_comments(
          *,
          user:user_id(id, first_name, last_name, firm_name)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching proposal:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Proposal not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Error fetching proposal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("GET proposal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/proposals/[id]
 * Update a proposal (submit, review, accept, reject, or modify)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      action,
      title,
      summary,
      review_comments,
    }: {
      action?:
        | "submit"
        | "review"
        | "accept"
        | "reject"
        | "supersede"
        | "update";
      title?: string;
      summary?: string;
      review_comments?: string;
    } = body;

    // Fetch the current proposal to check permissions
    const { data: currentProposal, error: fetchError } = await supabase
      .from("proposals")
      .select("*, deal_id")
      .eq("id", id)
      .single();

    if (fetchError || !currentProposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Check if user is a participant in the deal
    const { data: participant } = await supabase
      .from("deal_participants")
      .select("role")
      .eq("deal_id", currentProposal.deal_id)
      .eq("user_id", user.id)
      .single();

    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant in this deal" },
        { status: 403 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case "submit":
        // Only the author can submit
        if (currentProposal.proposed_by !== user.id) {
          return NextResponse.json(
            { error: "Only the author can submit this proposal" },
            { status: 403 }
          );
        }
        updateData = {
          status: "submitted",
          submitted_at: new Date().toISOString(),
        };
        break;

      case "review":
        // Change status to in_review
        updateData = {
          status: "in_review",
        };
        break;

      case "accept":
        // Only certain roles can accept (e.g., Arranger Counsel, Admin)
        if (!["Arranger Counsel", "Admin"].includes(participant.role)) {
          return NextResponse.json(
            {
              error: "Only Arranger Counsel or Admin can accept proposals",
            },
            { status: 403 }
          );
        }
        updateData = {
          status: "accepted",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_comments,
        };
        break;

      case "reject":
        // Any reviewer can reject
        updateData = {
          status: "rejected",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_comments,
        };
        break;

      case "supersede":
        updateData = {
          status: "superseded",
        };
        break;

      case "update":
        // Update title/summary (only author can do this for draft proposals)
        if (currentProposal.proposed_by !== user.id) {
          return NextResponse.json(
            { error: "Only the author can update this proposal" },
            { status: 403 }
          );
        }
        if (currentProposal.status !== "draft") {
          return NextResponse.json(
            { error: "Only draft proposals can be updated" },
            { status: 400 }
          );
        }
        updateData = {
          title,
          summary,
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    const { data: updatedProposal, error: updateError } = await supabase
      .from("proposals")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        author:proposed_by(id, first_name, last_name, firm_name),
        reviewer:reviewed_by(id, first_name, last_name),
        proposal_edits(*)
      `
      )
      .single();

    if (updateError) {
      console.error("Error updating proposal:", updateError);
      return NextResponse.json(
        { error: "Error updating proposal" },
        { status: 500 }
      );
    }

    // If the proposal was accepted, apply the edits to the document
    if (action === "accept" && updatedProposal) {
      try {
        // Fetch the current document
        const { data: document, error: docError } = await supabase
          .from("documents")
          .select("*")
          .eq("id", updatedProposal.document_id)
          .single();

        if (docError || !document) {
          console.error("Error fetching document:", docError);
          return NextResponse.json(
            {
              error: "Proposal accepted but failed to update document",
              proposal: updatedProposal,
            },
            { status: 500 }
          );
        }

        const edits = (updatedProposal as any).proposal_edits as ProposalEdit[];

        // Validate edits can be applied
        const validationErrors = validateProposalEdits(document.content, edits);
        if (validationErrors.length > 0) {
          console.error("Validation errors:", validationErrors);
          return NextResponse.json(
            {
              error: "Cannot apply proposal edits: " + validationErrors.join(", "),
              proposal: updatedProposal,
            },
            { status: 400 }
          );
        }

        // Apply the edits
        const updatedDocument = applyProposalEditsToDocument(
          document.content,
          edits
        );

        // Update the document in the database
        const { error: updateDocError } = await supabase
          .from("documents")
          .update({
            content: updatedDocument,
            updated_at: new Date().toISOString(),
          })
          .eq("id", document.id);

        if (updateDocError) {
          console.error("Error updating document:", updateDocError);
          return NextResponse.json(
            {
              error: "Proposal accepted but failed to save document changes",
              proposal: updatedProposal,
            },
            { status: 500 }
          );
        }

        // Create change summary for logging
        const changeSummary = createChangeSummary(edits);
        console.log(
          `Document ${document.id} updated: ${changeSummary.added} added, ${changeSummary.modified} modified, ${changeSummary.deleted} deleted`
        );

        return NextResponse.json({
          message:
            "Proposal accepted and document updated successfully",
          proposal: updatedProposal,
          documentUpdated: true,
          changeSummary,
        });
      } catch (error) {
        console.error("Error applying proposal edits:", error);
        return NextResponse.json(
          {
            error: "Proposal accepted but failed to update document",
            proposal: updatedProposal,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Proposal updated successfully",
      proposal: updatedProposal,
    });
  } catch (error) {
    console.error("PATCH proposal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/proposals/[id]
 * Delete a proposal (only author can delete draft proposals)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the proposal
    const { data: proposal, error: fetchError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Only author can delete
    if (proposal.proposed_by !== user.id) {
      return NextResponse.json(
        { error: "Only the author can delete this proposal" },
        { status: 403 }
      );
    }

    // Only draft proposals can be deleted
    if (proposal.status !== "draft") {
      return NextResponse.json(
        { error: "Only draft proposals can be deleted" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from("proposals")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting proposal:", deleteError);
      return NextResponse.json(
        { error: "Error deleting proposal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Proposal deleted successfully" });
  } catch (error) {
    console.error("DELETE proposal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
