import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
const done = (err: any, msg: string) => err ? fail(err.code === "42501" ? "You don't have permission to do that." : msg, err.code === "42501" ? 403 : 409) : NextResponse.json({ ok: true });
const ROLES = ["hostel_officer", "clearance_officer", "org_officer", "welfare_officer", "dean_office", "super_admin"];
// Every write runs as the signed-in staff member, so row-level security decides what they may change.
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return fail("Sign in first.", 401);
  const b = await req.json();

  if (b.action === "create_session") {
    if (!b.academic_session?.trim()) return fail("Enter the session, for example 2026/2027.");
    if (b.make_current) await db.from("hostel_sessions").update({ is_current: false }).eq("is_current", true);
    const { error } = await db.from("hostel_sessions").insert({ academic_session: b.academic_session.trim(), opens_at: b.opens_at || null, closes_at: b.closes_at || null, fresh_and_final_only: !!b.fresh_and_final_only, is_current: !!b.make_current });
    return done(error, "That session couldn't be saved. It may already exist.");
  }
  if (b.action === "create_hostel") {
    if (!b.name?.trim() || !["male", "female", "mixed"].includes(b.gender)) return fail("Enter a hostel name and choose a gender.");
    const { error } = await db.from("hostels").insert({ name: b.name.trim(), gender: b.gender, fee: b.fee ? Number(b.fee) : null });
    return done(error, "That hostel couldn't be saved. The name may already exist.");
  }
  if (b.action === "add_rooms") {
    const from = Number(b.from), to = Number(b.to), beds = Number(b.beds);
    if (!b.hostel_id || !Number.isInteger(from) || !Number.isInteger(to) || to < from || to - from > 499) return fail("Enter a room range of up to 500 rooms.");
    if (!(beds >= 1 && beds <= 12)) return fail("Beds per room must be between 1 and 12.");
    const block = (b.block ?? "").trim();
    const rows = Array.from({ length: to - from + 1 }, (_, i) => ({ hostel_id: b.hostel_id, block, room_no: String(from + i) }));
    const { data: rooms, error } = await db.from("rooms").insert(rows).select("id");
    if (error || !rooms) return done(error ?? { code: "x" }, "Some of those rooms already exist in this block.");
    const labels = "ABCDEFGHIJKL";
    const { error: e2 } = await db.from("bed_spaces").insert(rooms.flatMap((r) => Array.from({ length: beds }, (_, i) => ({ room_id: r.id, label: labels[i] }))));
    return done(e2, "Rooms were added but some beds couldn't be saved.");
  }
  if (b.action === "add_unit") {
    if (!b.name?.trim() || !Number(b.sequence)) return fail("Enter a unit name and its order number.");
    const { error } = await db.from("clearance_units").insert({ name: b.name.trim(), sequence: Number(b.sequence) });
    return done(error, "That unit couldn't be saved. The name may already exist.");
  }
  if (b.action === "assign_role") {
    if (!ROLES.includes(b.role)) return fail("Choose a role.");
    const { data: p } = await db.from("profiles").select("id").ilike("email", String(b.email ?? "").trim()).maybeSingle();
    if (!p) return fail("No account has that email. They must sign up first.");
    const { error } = await db.from("user_roles").upsert({ user_id: p.id, role: b.role }, { onConflict: "user_id,role", ignoreDuplicates: true });
    if (error) return done(error, "The role couldn't be saved.");
    if (b.role === "clearance_officer" && b.unit_id) {
      const { error: e2 } = await db.from("unit_officers").upsert({ user_id: p.id, unit_id: b.unit_id }, { onConflict: "user_id,unit_id", ignoreDuplicates: true });
      return done(e2, "The unit assignment couldn't be saved.");
    }
    return NextResponse.json({ ok: true });
  }
  return fail("Unknown action.");
}
