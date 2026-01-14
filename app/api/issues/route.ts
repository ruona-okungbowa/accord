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

    return NextResponse.json({});
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
  } catch (error) {}
}
