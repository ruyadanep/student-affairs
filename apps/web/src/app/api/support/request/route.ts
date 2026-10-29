import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
const KINDS = ["counselling", "special_needs", "complaint", "hardship"];
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const b = await req.json();
  if (!KINDS.includes(b.kind) || !String(b.subject ?? "").trim() || !String(b.details ?? "").trim()) return NextResponse.json({ error: "Choose a type and fill in the subject and details." }, { status: 400 });
  if (String(b.details).length > 4000) return NextResponse.json({ error: "Please keep the details under 4000 characters." }, { status: 400 });
  const { error } = await db.from("support_requests").insert({ student_id: user.id, kind: b.kind, subject: String(b.subject).trim().slice(0, 150), details: String(b.details).trim(), preferred_times: b.kind === "counselling" ? String(b.preferred_times ?? "").slice(0, 300) || null : null });
  if (error) return NextResponse.json({ error: "Your request couldn't be saved. Try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
