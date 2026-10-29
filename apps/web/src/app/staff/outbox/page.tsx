import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import SendNow from "./SendNow";

export const metadata = { title: "Delivery queue" };

export default async function Page() {
  await requireRole(["dean_office", "hostel_officer"], "/staff/outbox");
  const admin = supabaseAdmin();
  const count = async (s: string) => (await admin.from("outbound_messages").select("id", { count: "exact", head: true }).eq("status", s)).count ?? 0;
  const [q, s, f] = await Promise.all([count("queued"), count("sent"), count("failed")]);
  const { data: bad } = await admin.from("outbound_messages").select("channel,error,created_at").eq("status", "failed").order("created_at", { ascending: false }).limit(10);
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link href="/staff/announce" className="text-sm text-[#0b5c36] underline">← Announcements</Link>
      <h1 className="text-2xl font-bold">Delivery queue</h1>
      <p className="text-sm"><b>{q}</b> queued · <b>{s}</b> sent · <b>{f}</b> failed. Messages go out automatically every few minutes once the scheduler is set up (see DEPLOY.md).</p>
      <SendNow />
      {(bad ?? []).length > 0 && <ul className="divide-y rounded border text-sm">{(bad ?? []).map((b: { channel: string; error: string | null; created_at: string }, i: number) => <li key={i} className="p-3">{b.channel}: {b.error}</li>)}</ul>}
    </main>
  );
}
