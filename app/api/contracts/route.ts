import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorised user" }, { status: 401 });
    }

    const { data: contracts, error } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ contracts });
  } catch (error) {
    console.error("GET contracts route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
