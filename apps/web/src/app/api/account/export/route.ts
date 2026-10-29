import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// "Download my data": everything the signed-in user can read about themselves, as JSON (NDPA right of access).
export async function GET() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const own = async (table: string, col: string) => (await db.from(table).select("*").eq(col, user.id)).data ?? [];
  const out = {
    exported_at: new Date().toISOString(),
    profile: (await db.from("profiles").select("*").eq("id", user.id).maybeSingle()).data,
    hostel_applications: await own("hostel_applications", "student_id"),
    payment_records: await own("payment_records", "student_id"),
    clearance_requests: await own("clearance_requests", "student_id"),
    document_requests: await own("document_requests", "student_id"),
    support_requests: await own("support_requests", "student_id"),
    maintenance_tickets: await own("maintenance_tickets", "reporter_id"),
    notifications: await own("notifications", "user_id"),
    event_rsvps: await own("event_rsvps", "student_id"),
    organisation_memberships: await own("organisation_members", "student_id"),
    login_history: await own("login_events", "user_id"),
    data_requests: await own("data_requests", "student_id"),
  };
  return new NextResponse(JSON.stringify(out, null, 2), {
    headers: { "content-type": "application/json", "content-disposition": 'attachment; filename="my-plasu-data.json"', "cache-control": "no-store" },
  });
}
