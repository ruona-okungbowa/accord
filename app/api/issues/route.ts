import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * List all the issues for a deal
 * GET /api/issues?id=xxx
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

    const { data: issues, error } = await supabase
      .from("issues")
      .select("*, created_by:users!issues_created_by_fkey(first_name, last_name), assigned_to:users!issues_assigned_to_fkey(first_name, last_name)")
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("GET issues route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Create a new issues
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
    const { deal_id, document_id, title, description, section_id, clause_ref, priority, type } = body;

    if (!deal_id || !document_id || !title || !section_id || !clause_ref) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: issue, error } = await supabase
      .from("issues")
      .insert({
        deal_id,
        document_id,
        title,
        description,
        section_id,
        clause_ref,
        priority: priority || "medium",
        created_by: user.id,
        status: "drafted",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ issue }, { status: 201 });
  } catch (error) {
    console.error("POST issues route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
