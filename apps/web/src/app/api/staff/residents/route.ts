import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id, action } = await req.json(); const now = new Date().toISOString();
  const patch = action === "check_in" ? { checked_in_at: now } : action === "check_out" ? { checked_out_at: now, status: "vacated" } : null;
  if (!patch) return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  const { data, error } = await db.from("allocations").update(patch).eq("id", id).select("id").maybeSingle(); // hostel officers only
  if (error || !data) return NextResponse.json({ error: "You can't update this resident." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
