import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { allocation_id, reason } = await req.json();
  if (!String(reason ?? "").trim()) return NextResponse.json({ error: "Tell us why you want to change rooms." }, { status: 400 });
  const { error } = await db.from("room_change_requests").insert({ allocation_id, reason: String(reason).trim() }); // row-level security: only your own allocation
  if (error) return NextResponse.json({ error: "Your request couldn't be saved." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
