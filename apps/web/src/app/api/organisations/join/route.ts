import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { organisation_id, action } = await req.json();
  const { error } = action === "leave"
    ? await db.from("organisation_members").delete().eq("organisation_id", organisation_id).eq("student_id", user.id)
    : await db.from("organisation_members").insert({ organisation_id, student_id: user.id });
  if (error) return NextResponse.json({ error: "That didn't work. You may already be a member." }, { status: 409 });
  return NextResponse.json({ ok: true });
}
