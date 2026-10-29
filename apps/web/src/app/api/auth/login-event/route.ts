import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
  await db.from("login_events").insert({ email: user.email ?? null, ip, user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300) });
  return NextResponse.json({ ok: true });
}
