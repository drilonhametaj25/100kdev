import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  language: z.enum(["en", "it"]).default("en"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { email, language } = result.data;
    const supabase = createAdminClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, confirmed, unsubscribed_at")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      if (existing.confirmed && !existing.unsubscribed_at) {
        return NextResponse.json(
          { success: true, message: "Already subscribed", alreadySubscribed: true }
        );
      }

      // Resubscribe if previously unsubscribed
      if (existing.unsubscribed_at) {
        await supabase
          .from("subscribers")
          .update({
            unsubscribed_at: null,
            confirmed: true,
            language,
          })
          .eq("id", existing.id);

        return NextResponse.json({
          success: true,
          message: "Welcome back! You're subscribed.",
        });
      }
    }

    // Create new subscriber
    const { error: insertError } = await supabase.from("subscribers").insert({
      email: email.toLowerCase(),
      language,
      confirmed: true, // For MVP, skip double opt-in
    });

    if (insertError) {
      if (insertError.code === "23505") {
        // Unique violation
        return NextResponse.json({
          success: true,
          message: "Already subscribed",
          alreadySubscribed: true,
        });
      }
      console.error("Subscriber insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to subscribe", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email with Resend
    // await sendConfirmationEmail(email, confirmationToken, language);

    return NextResponse.json({
      success: true,
      message: "You're in! We'll notify you before flash drops.",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
