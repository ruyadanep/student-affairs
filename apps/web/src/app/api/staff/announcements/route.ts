import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const b = await req.json();
  const args = { p_hostels: b.hostel_ids ?? [], p_levels: (b.levels ?? []).map(Number), p_faculties: b.faculties ?? [] };
  if (b.action === "count") {
    const { data, error } = await db.rpc("count_announcement_recipients", args);
    if (error) return NextResponse.json({ error: "Couldn't count recipients." }, { status: 500 });
    return NextResponse.json({ count: data });
  }
  const { data, error } = await db.rpc("send_announcement", { ...args, p_title: b.title ?? "", p_body: b.body ?? "" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, sent: data });
}
