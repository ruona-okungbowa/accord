import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
      return new NextResponse(JSON.stringify({ error: "Unauthorised user" }), {
        status: 401,
      });
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Missing contract ID" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .eq("id", id)
      .eq("created_by", user.id)
      .single();

    const { data: dealUser, error: userError } = await supabase
      .from("deal_participants")
      .select("*")
      .eq("deal_id", id)
      .eq("user_id", user.id)
      .single();

    if (userError) {
      console.error("Error fetching deal participant:", userError);
      return NextResponse.json(
        { error: "Error fetching contract participant" },
        { status: 500 }
      );
    }

    if (error) {
      console.error("Error fetching contract:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Contract not found" },
          { status: 404 }
        );
      }
      return new NextResponse(
        JSON.stringify({ error: "Error fetching contract" }),
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      contract: data,
      user: dealUser,
    });
  } catch (error) {
    console.error("GET contract route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
