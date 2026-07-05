import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase-server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();

  const [{ count: totalVerified }, { count: totalEvents }, { data: recentEvents }] = await Promise.all([
    db.from("verification_events").select("*", { count: "exact", head: true }).eq("event_type", "verified"),
    db.from("verification_events").select("*", { count: "exact", head: true }),
    db.from("verification_events").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  return NextResponse.json({
    totalVerified: totalVerified ?? 0,
    totalEvents:   totalEvents  ?? 0,
    recentEvents:  recentEvents ?? [],
  });
}
