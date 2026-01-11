import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/proposals/[id]/comments
 * Add a comment to a proposal
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: proposalId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content }: { content: string } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Verify the proposal exists
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .select("id, deal_id")
      .eq("id", proposalId)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Verify user is a participant in the deal
    const { data: participant } = await supabase
      .from("deal_participants")
      .select("id")
      .eq("deal_id", proposal.deal_id)
      .eq("user_id", user.id)
      .single();

    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant in this deal" },
        { status: 403 }
      );
    }

    // Create the comment
    const { data: comment, error: commentError } = await supabase
      .from("proposal_comments")
      .insert({
        proposal_id: proposalId,
        user_id: user.id,
        content: content.trim(),
      })
      .select(
        `
        *,
        user:user_id(id, first_name, last_name, firm_name)
      `
      )
      .single();

    if (commentError) {
      console.error("Error creating comment:", commentError);
      return NextResponse.json(
        { error: "Error creating comment" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Comment added successfully",
        comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
