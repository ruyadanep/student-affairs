import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// Whitelisted database functions staff screens may call. Every function checks the caller's role itself.
const ALLOWED = new Set([
  "reconcile_payments", "auto_allocate", "swap_beds", "set_priority", "approve_ready_steps",
  "save_template", "delete_template", "schedule_announcement", "cancel_scheduled",
  "decide_event", "checkin_event", "create_election", "add_position", "add_candidate", "set_election_state",
  "load_voter_roll", "publish_results", "open_case", "add_case_event", "schedule_hearing", "add_sanction",
  "decide_appeal", "set_case_status", "notify_student_of_case", "place_hold", "lift_hold", "assign_case",
  "request_super_admin", "approve_super_admin", "reject_super_admin", "decide_data_request",
  "log_visitor", "checkout_visitor", "add_lost_item", "resolve_lost_item", "add_inventory", "update_inventory",
  "set_setting", "cast_votes",
]);

export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || typeof b.fn !== "string" || !ALLOWED.has(b.fn)) return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  const { data, error } = await db.rpc(b.fn, b.args ?? {});
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}
