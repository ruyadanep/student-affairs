import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { ticket_id, body } = await req.json();
  if (!ticket_id || !String(body ?? "").trim()) return NextResponse.json({ error: "Write a message first." }, { status: 400 });
  const { error } = await db.from("ticket_comments").insert({ ticket_id, author_id: user.id, body: String(body).trim() }); // row-level security: reporter or hostel officer only
  if (error) return NextResponse.json({ error: "Your message couldn't be sent." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
