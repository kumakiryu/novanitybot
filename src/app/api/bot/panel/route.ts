import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendVerificationPanel } from "@/lib/discord";
import { createServerClient } from "@/lib/supabase-server";
import type { VerificationConfig } from "@/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { channelId, config }: { channelId: string; config: Partial<VerificationConfig> } = await req.json();
    if (!channelId) return NextResponse.json({ error: "channelId is required" }, { status: 400 });

    await sendVerificationPanel(channelId, {
      embedTitle:       config.embed_title       ?? "NO VANITY",
      embedDescription: config.embed_description ?? "Verification Required. Click Verify to gain access.",
      embedColor:       config.embed_color        ?? 0xd946ef,
      embedFooter:      config.embed_footer       ?? "NO VANITY Verification System",
      buttonLabel:      config.button_label       ?? "Verify",
      buttonStyle:      config.button_style       ?? "Success",
    });

    // Log the panel send in Supabase
    const db = createServerClient();
    await db.from("verification_events").insert({ event_type: "panel_sent" });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[api/bot/panel]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
