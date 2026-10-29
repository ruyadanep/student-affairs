import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { normalisePhone } from "@/lib/messaging";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const raw = String(b.phone ?? "").trim();
  const phone = raw ? normalisePhone(raw) : "";
  if (raw && !phone) return NextResponse.json({ error: "That phone number doesn't look right." }, { status: 400 });
  const { error } = await db.rpc("set_my_alerts", { p_email: !!b.email, p_sms: !!b.sms, p_phone: phone ? "+" + phone : "" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
