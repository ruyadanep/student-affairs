import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const b = await req.json();
  if (String(b.confirm ?? "").trim() !== String(b.session ?? "").trim() || !String(b.session ?? "").trim()) return NextResponse.json({ error: "Type the new session name exactly to confirm." }, { status: 400 });
  const iso = (v: unknown) => { const d = new Date(String(v ?? "")); return isNaN(+d) ? null : d.toISOString(); };
  const { data, error } = await db.rpc("rollover_session", { p_new: b.session, p_opens: iso(b.opens_at), p_closes: iso(b.closes_at), p_vacate: !!b.vacate, p_reset_fresh: !!b.reset_fresh });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, ...data });
}
