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

    const body = await request.json();
    const { deal_id, document_id, title, summary, proposed_text, section_id } = body;

    if (!deal_id || !document_id || !title || !proposed_text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: proposal, error } = await supabase
      .from("proposals")
      .insert({
        deal_id,
        document_id,
        section_id,
        title,
        summary: summary || "",
        proposed_text,
        proposed_by: user.id,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    // Create proposal edit entry if section_id provided
    if (section_id && proposal) {
      await supabase.from("proposal_edits").insert({
        proposal_id: proposal.id,
        section_id,
        action: "modify",
        original_text: "",
        proposed_text,
        order: 0,
      });
    }

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error("POST proposals route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
