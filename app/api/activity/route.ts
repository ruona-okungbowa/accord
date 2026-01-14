import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised user" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get("id");

    if (!dealId) {
      return NextResponse.json({ error: "Deal ID is required" }, { status: 400 });
    }

    // Fetch issues created
    const { data: issues } = await supabase
      .from("issues")
      .select("id, title, created_at, created_by:users!issues_created_by_fkey(first_name, last_name)")
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false });

    // Fetch proposals
    const { data: proposals } = await supabase
      .from("proposals")
      .select("id, title, status, created_at, proposed_by:users!proposals_proposed_by_fkey(first_name, last_name)")
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false });

    // Fetch deal participants
    const { data: participants } = await supabase
      .from("deal_participants")
      .select("id, accepted_at, user_id:users!deal_participants_user_id_fkey(first_name, last_name), role")
      .eq("deal_id", dealId)
      .order("accepted_at", { ascending: false });

    // Combine and format activities
    const activities = [
      ...(issues || []).map((issue) => ({
        id: `issue-${issue.id}`,
        type: "issue_created",
        title: `Issue raised: ${issue.title}`,
        user: `${issue.created_by?.first_name} ${issue.created_by?.last_name}`,
        timestamp: issue.created_at,
      })),
      ...(proposals || []).map((proposal) => ({
        id: `proposal-${proposal.id}`,
        type: proposal.status === "accepted" ? "proposal_accepted" : proposal.status === "rejected" ? "proposal_rejected" : "proposal_created",
        title: proposal.status === "accepted" ? `Amendment accepted: ${proposal.title}` : proposal.status === "rejected" ? `Amendment rejected: ${proposal.title}` : `Amendment proposed: ${proposal.title}`,
        user: `${proposal.proposed_by?.first_name} ${proposal.proposed_by?.last_name}`,
        timestamp: proposal.created_at,
      })),
      ...(participants || []).filter((p) => p.accepted_at).map((participant) => ({
        id: `participant-${participant.id}`,
        type: "participant_joined",
        title: `${participant.user_id?.first_name} ${participant.user_id?.last_name} joined as ${participant.role}`,
        user: `${participant.user_id?.first_name} ${participant.user_id?.last_name}`,
        timestamp: participant.accepted_at,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("GET activity route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
