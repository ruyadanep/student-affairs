import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { data: s } = await db.from("hostel_sessions").select("academic_session").eq("is_current", true).maybeSingle();
  if (!s) return NextResponse.json({ error: "Clearance isn't open yet." }, { status: 403 });
  const { error } = await db.rpc("start_clearance", { p_session: s.academic_session });
  if (error) return NextResponse.json({ error: "Clearance couldn't be started. Try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
