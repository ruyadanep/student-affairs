import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id, approve, note } = await req.json();
  if (!approve && !String(note ?? "").trim()) return NextResponse.json({ error: "Give a reason for rejecting." }, { status: 400 });
  const { data, error } = await db.from("organisations").update({ status: approve ? "approved" : "rejected", reviewed_by: user.id, review_note: approve ? null : note }).eq("id", id).eq("status", "submitted").select("submitted_by,name").maybeSingle(); // only organisation officers and the Dean's office pass row-level security
  if (error || !data) return NextResponse.json({ error: "You can't review this, or it was already reviewed." }, { status: 403 });
  await db.from("notifications").insert({ user_id: data.submitted_by, title: approve ? `${data.name} is registered` : `${data.name} was not approved`, body: approve ? "Your organisation now appears in the directory." : String(note) });
  return NextResponse.json({ ok: true });
}
