import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
const STATUSES = ["in_progress", "resolved", "closed"];
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id, action, status } = await req.json();
  let patch: Record<string, unknown>;
  if (action === "assign") patch = { assigned_to: user.id, status: "assigned" };
  else if (action === "status" && STATUSES.includes(status)) patch = { status, resolved_at: status === "resolved" ? new Date().toISOString() : null };
  else return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  const { data, error } = await db.from("maintenance_tickets").update(patch).eq("id", id).select("reporter_id").maybeSingle(); // only hostel officers pass row-level security
  if (error || !data) return NextResponse.json({ error: "You can't update this ticket." }, { status: 403 });
  if (status === "resolved") await db.from("notifications").insert({ user_id: data.reporter_id, title: "Your hostel fault was fixed", body: "Open Maintenance to confirm or add a message." });
  return NextResponse.json({ ok: true });
}
