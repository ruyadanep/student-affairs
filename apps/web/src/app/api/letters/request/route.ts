import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { doc_type, purpose, addressee } = await req.json();
  if (!doc_type || !String(purpose ?? "").trim()) return NextResponse.json({ error: "Choose a letter type and say what it's for." }, { status: 400 });
  const { error } = await db.from("document_requests").insert({ student_id: user.id, doc_type, purpose: String(purpose).trim(), addressee: addressee?.trim() || null, status: "submitted" });
  if (error) return NextResponse.json({ error: "Your request couldn't be saved. Try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
