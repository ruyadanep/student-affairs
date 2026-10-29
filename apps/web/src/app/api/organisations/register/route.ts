import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { name, category, description } = await req.json();
  if (!String(name ?? "").trim() || !String(description ?? "").trim()) return NextResponse.json({ error: "Enter a name and say what the organisation does." }, { status: 400 });
  const { data, error } = await db.from("organisations").insert({ name: String(name).trim(), category: category || null, description: String(description).trim(), submitted_by: user.id, status: "submitted" }).select("id").single();
  if (error || !data) return NextResponse.json({ error: "That name couldn't be saved. It may already be registered." }, { status: 409 });
  await db.from("organisation_members").insert({ organisation_id: data.id, student_id: user.id, position: "Founder" });
  return NextResponse.json({ ok: true });
}
