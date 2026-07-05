import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase-server";

const GUILD_ID = "default";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();
  const { data, error } = await db.from("verification_configs").select("*").eq("guild_id", GUILD_ID).single();
  if (error && error.code !== "PGRST116") return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? {});
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const db = createServerClient();
    const { data, error } = await db
      .from("verification_configs")
      .upsert({ ...body, guild_id: GUILD_ID, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
  }
}
