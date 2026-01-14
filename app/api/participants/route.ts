import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dealId, participants } = await request.json();

    if (!dealId || !participants || !Array.isArray(participants)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Insert participants into deal_participants table
    const participantsToInsert = participants.map((p: { email: string; role: string }) => ({
      deal_id: dealId,
      email: p.email,
      role: p.role,
      invited_by: user.id,
      invited_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("deal_participants")
      .insert(participantsToInsert)
      .select();

    if (error) {
      console.error("Error inviting participants:", error);
      return NextResponse.json({ error: "Failed to invite participants" }, { status: 500 });
    }

    return NextResponse.json({ success: true, participants: data });
  } catch (error) {
    console.error("POST participants route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
