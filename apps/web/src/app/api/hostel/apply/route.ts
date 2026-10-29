import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return fail("Sign in first.", 401);
  const { preference_1, preference_2, reference } = await req.json();
  if (!preference_1) return fail("Choose a first-choice hostel.");
  const { data: s } = await db.from("hostel_sessions").select("*").eq("is_current", true).maybeSingle();
  const now = Date.now();
  if (!s || (s.opens_at && +new Date(s.opens_at) > now) || (s.closes_at && +new Date(s.closes_at) < now)) return fail("Hostel applications aren't open right now.", 403);
  const { data: me } = await db.from("profiles").select("is_fresh,is_final_year").eq("id", user.id).single();
  if (s.fresh_and_final_only && !(me?.is_fresh || me?.is_final_year)) return fail("This session is open to fresh and final-year students only.", 403);
  let { data: pay } = await db.from("payment_records").select("id,status").eq("student_id", user.id).eq("academic_session", s.academic_session).maybeSingle();
  if (pay?.status === "rejected" || pay?.status === "reversed") return fail("Your payment couldn't be confirmed. Contact the hostel office.", 403);
  if (!pay) {
    if (!reference) return fail("Enter your payment reference.");
    const ins = await db.from("payment_records").insert({ student_id: user.id, academic_session: s.academic_session, reference, status: "pending_check", source: "manual" }).select("id,status").single();
    if (ins.error) return fail("That reference couldn't be saved. It may already be in use.", 409);
    pay = ins.data;
  }
  const { error } = await db.from("hostel_applications").upsert({ student_id: user.id, session_id: s.id, payment_id: pay!.id, preference_1, preference_2: preference_2 || null, status: pay!.status === "verified" ? "eligible" : "submitted" }, { onConflict: "student_id,session_id" });
  if (error) return fail("Your application couldn't be saved. Try again.", 500);
  return NextResponse.json({ note: pay!.status === "verified" ? "Application submitted. Your payment is confirmed." : "Application submitted. Staff will check your payment." });
}
