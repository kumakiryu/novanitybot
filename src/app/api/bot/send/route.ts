import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendMessage } from "@/lib/discord";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { channelId, payload } = await req.json();
    if (!channelId) return NextResponse.json({ error: "channelId is required" }, { status: 400 });
    await sendMessage(channelId, payload);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[api/bot/send]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
