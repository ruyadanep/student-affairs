import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id, action, status, scheduled_at, note } = await req.json();
  let patch: Record<string, unknown>; let body = "Open Support to see the update.";
  if (action === "schedule") {
    const d = new Date(scheduled_at); if (!scheduled_at || isNaN(+d)) return NextResponse.json({ error: "Choose a date and time." }, { status: 400 });
    patch = { status: "scheduled", scheduled_at: d.toISOString() };
    body = `Your appointment is on ${d.toLocaleString("en-GB", { timeZone: "Africa/Lagos", dateStyle: "full", timeStyle: "short" })}.`;
  } else if (action === "status" && ["in_review", "resolved", "closed"].includes(status)) patch = { status, resolution_note: note || null };
  else return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  const { data, error } = await db.from("support_requests").update({ ...patch, assigned_to: user.id, updated_at: new Date().toISOString() }).eq("id", id).select("student_id").maybeSingle(); // only the right staff pass row-level security
  if (error || !data) return NextResponse.json({ error: "You can't update this request." }, { status: 403 });
  await db.from("notifications").insert({ user_id: data.student_id, title: "Update on your support request", body }); // never includes what the student wrote
  return NextResponse.json({ ok: true });
}
