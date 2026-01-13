import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * List all the proposals for a deal
 * GET /api/proposals?id=xxx
 * @param request
 */
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
      return NextResponse.json(
        { error: "Deal ID is required" },
        { status: 400 }
      );
    }

    const { data: proposals, error } = await supabase
      .from("proposals")
      .select(
        `*, author:proposed_by(id, first_name,last_name,firm_name),reviewer:reviewed_by(id,first_name,last_name)`
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
    console.error("GET proposals route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Create a new proposal
 * @param request
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised user" }, { status: 401 });
    }
  } catch (error) {}
}
