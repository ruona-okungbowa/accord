import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const { dealId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorised user" }), {
        status: 401,
      });
    }

    if (!dealId) {
      return new NextResponse(
        JSON.stringify({ error: "Missing deal ID" }),
        { status: 400 }
      );
    }

    const { data: document, error } = await supabase
      .from("documents")
      .select("*")
      .eq("deal_id", dealId)
      .single();

    if (error) {
      console.error("Error fetching document:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }
      return new NextResponse(
        JSON.stringify({ error: "Error fetching document" }),
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("GET document route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
