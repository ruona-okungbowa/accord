import { createClient } from "@/lib/supabase/server";
import { LoginFormSchema } from "@/lib/validations/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedFields = LoginFormSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      // Handle specific authentication errors
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("Email not confirmed") ||
        error.message.includes("Invalid email or password")
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid email or password. Please check your credentials and try again.",
          },
          { status: 401 }
        );
      }

      if (error.message.includes("Email not confirmed")) {
        return NextResponse.json(
          { error: "Please verify your email address before logging in." },
          { status: 401 }
        );
      }

      if (error.message.includes("Too many requests")) {
        return NextResponse.json(
          { error: "Too many login attempts. Please try again later." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Login failed. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: data.user?.id,
        email: data.user?.email,
        user_metadata: data.user?.user_metadata,
      },
      session: data.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
