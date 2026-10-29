import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail, sendSms } from "@/lib/messaging";

export const maxDuration = 60;

async function authorised(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") === `Bearer ${secret}`) return true;
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return false;
  const { data } = await db.from("user_roles").select("role").eq("user_id", user.id);
  return (data ?? []).some((r: { role: string }) => ["super_admin", "dean_office", "hostel_officer"].includes(r.role));
}

async function run(req: Request) {
  if (!(await authorised(req))) return NextResponse.json({ error: "Not allowed." }, { status: 401 });
  const admin = supabaseAdmin();
  const { data: scheduled } = await admin.rpc("process_scheduled");
  const { data: batch } = await admin.from("outbound_messages").select("*").eq("status", "queued").lt("attempts", 3).order("created_at").limit(40);
  let sent = 0, failed = 0;
  for (const m of (batch ?? []) as { id: string; channel: string; to_address: string; subject: string | null; body: string; attempts: number }[]) {
    const r = m.channel === "email" ? await sendEmail(m.to_address, m.subject ?? "PLASU Student Affairs", m.body) : await sendSms(m.to_address, m.body);
    const attempts = m.attempts + 1;
    await admin.from("outbound_messages").update({
      status: r.ok ? "sent" : attempts >= 3 ? "failed" : "queued", attempts, error: r.ok ? null : r.error, sent_at: r.ok ? new Date().toISOString() : null,
    }).eq("id", m.id);
    if (r.ok) sent++; else failed++;
  }
  return NextResponse.json({ ok: true, scheduled_sent: scheduled ?? 0, sent, failed });
}
export const GET = run;
export const POST = run;
