import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
// All writes run as the signed-in officer, so row-level security decides who may do what.
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return fail("Sign in first.", 401);
  const { action, id } = await req.json();

  if (action === "verify_payment" || action === "reject_payment") {
    const status = action === "verify_payment" ? "verified" : "rejected";
    const { data, error } = await db.from("payment_records").update({ status, verified_by: user.id, verified_at: new Date().toISOString() }).eq("id", id).select("id").maybeSingle();
    if (error || !data) return fail("You can't update this payment.", 403);
    await db.from("hostel_applications").update({ status: status === "verified" ? "eligible" : "rejected", reason: status === "rejected" ? "Payment could not be confirmed." : null }).eq("payment_id", id).in("status", ["submitted", "eligible"]);
    return NextResponse.json({ ok: true });
  }

  if (action === "allocate") {
    const { data: app } = await db.from("hostel_applications").select("id,student_id,status,preference_1,preference_2,profiles(gender)").eq("id", id).single();
    if (!app || app.status !== "eligible") return fail("Only applications with confirmed payment can be allocated.");
    const gender = (app as any).profiles?.gender;
    const { data: taken } = await db.from("allocations").select("bed_space_id").eq("status", "active");
    const { data: prev } = await db.from("allocations").select("bed_space_id").eq("application_id", app.id); // never put a student back in a bed they just left
    const ids = [...(taken ?? []), ...(prev ?? [])].map((t) => t.bed_space_id);
    for (const hid of [app.preference_1, app.preference_2].filter(Boolean)) {
      const { data: h } = await db.from("hostels").select("gender,name").eq("id", hid).single();
      if (!h || (h.gender !== "mixed" && h.gender !== gender)) continue;
      let q = db.from("bed_spaces").select("id, rooms!inner(hostel_id)").eq("rooms.hostel_id", hid).limit(1);
      if (ids.length) q = q.not("id", "in", `(${ids.join(",")})`);
      const { data: bed } = await q.maybeSingle();
      if (!bed) continue;
      const a = await db.from("allocations").insert({ application_id: app.id, bed_space_id: bed.id }).select("id").single();
      if (a.error) return fail("Allocation failed. Try again.", 409);
      await db.from("hostel_applications").update({ status: "allocated", reason: null }).eq("id", app.id);
      await db.from("notifications").insert({ user_id: app.student_id, title: "Hostel room allocated", body: `You have been allocated a bed in ${h.name}. Open Hostels to see your room.` });
      return NextResponse.json({ ok: true, hostel: h.name });
    }
    await db.from("hostel_applications").update({ status: "waitlisted", reason: "No space in your chosen hostels right now." }).eq("id", app.id);
    return NextResponse.json({ ok: true, waitlisted: true });
  }
  return fail("Unknown action.");
}
