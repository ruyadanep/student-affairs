import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// Records a hostel payment reference and, if the main site (plasu.edu.ng) exposes an API, confirms it.
// This platform never collects money. Without the API, the record stays "pending_check" for staff to verify.
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { reference, academic_session } = await req.json();
  if (!reference || !academic_session) return NextResponse.json({ error: "Reference and session are required." }, { status: 400 });

  let verified = false;
  const url = process.env.PLASU_PAYMENT_API_URL;
  if (url) {
    try {
      const res = await fetch(`${url}?reference=${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env.PLASU_PAYMENT_API_KEY ?? ""}` }, cache: "no-store" });
      verified = res.ok && (await res.json()).status === "paid"; // adjust to the main site's real response
    } catch {}
  }
  const { data, error } = await db.from("payment_records").insert({
    student_id: user.id, academic_session, reference, status: "pending_check", source: "manual",
  }).select("id, status").single();
  if (error) return NextResponse.json({ error: "That reference could not be saved. It may already be used." }, { status: 409 });
  return NextResponse.json({ ...data, auto_verified: verified, note: verified ? "Confirmed by main site. Staff will finalise." : "Sent to hostel staff for checking." });
}
