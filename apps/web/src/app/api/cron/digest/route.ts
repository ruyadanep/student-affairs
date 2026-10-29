import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Monthly Dean digest: queues one email per Dean's-office user. Call from a monthly cron.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Not allowed." }, { status: 401 });
  const admin = supabaseAdmin();
  const { data: s } = await admin.rpc("digest_summary");
  const d = (s ?? {}) as Record<string, number>;
  const body = [
    "Student Affairs: last 30 days",
    `Hostel applications: ${d.applications} · beds allocated: ${d.allocated} · waitlisted now: ${d.waitlisted}`,
    `Maintenance: ${d.tickets_opened} reported, ${d.tickets_open_now} still open`,
    `Clearance: ${d.cleared} students cleared, ${d.clearance_waiting} steps waiting`,
    `Letters waiting: ${d.letters_waiting} · Open support requests: ${d.support_open}`,
  ].join("\n");
  const { data: deans } = await admin.from("user_roles").select("profiles(id,email)").eq("role", "dean_office");
  const rows = ((deans ?? []) as unknown as { profiles: { id: string; email: string | null } | { id: string; email: string | null }[] | null }[])
    .map((r) => (Array.isArray(r.profiles) ? r.profiles[0] : r.profiles)).filter((p): p is { id: string; email: string } => !!p?.email)
    .map((p) => ({ channel: "email", user_id: p.id, to_address: p.email, subject: "Student Affairs monthly digest", body }));
  if (rows.length) await admin.from("outbound_messages").insert(rows);
  return NextResponse.json({ ok: true, queued: rows.length });
}
