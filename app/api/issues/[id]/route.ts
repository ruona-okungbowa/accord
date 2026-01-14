import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Update issue status or resolve issue
 * PATCH /api/issues/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, resolution_notes } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Get issue to verify deal_id
    const { data: issue } = await supabase
      .from("issues")
      .select("deal_id")
      .eq("id", id)
      .single();

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Verify user is arranger_counsel for resolution
    const { data: participant } = await supabase
      .from("deal_participants")
      .select("role")
      .eq("deal_id", issue.deal_id)
      .eq("user_id", user.id)
      .single();

    if (!participant || participant.role !== "arranger_counsel") {
      return NextResponse.json(
        { error: "Only arranger counsel can resolve issues" },
        { status: 403 }
      );
    }

    const updateData: any = { status };
    
    if (status === "legally_final") {
      updateData.resolved_by = user.id;
      updateData.resolved_at = new Date().toISOString();
      if (resolution_notes) {
        updateData.resolution_notes = resolution_notes;
      }
    }

    const { data: updated, error } = await supabase
      .from("issues")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ issue: updated });
  } catch (error) {
    console.error("PATCH issue error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
