import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import Announce from "./Announce";
import RpcForm from "@/components/RpcForm";

export const metadata = { title: "Announcements: email, SMS and scheduling" };

export default async function Page() {
  const { db } = await requireRole(["dean_office", "hostel_officer"], "/staff/announce");
  const [{ data: hostels }, { data: templates }, { data: scheduled }] = await Promise.all([
    db.from("hostels").select("id,name").order("name"),
    db.from("announcement_templates").select("id,name,title,body").order("name"),
    db.from("scheduled_announcements").select("id,title,send_at,channels").eq("status", "scheduled").order("send_at"),
  ]);
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div><Link href="/staff" className="text-sm text-[#0b5c36] underline">← Staff tools</Link>
        <h1 className="mt-2 text-2xl font-bold">Announcements</h1>
        <p className="text-sm text-gray-700">Email and SMS only reach students who opted in and have an address or number on file. SMS needs a registered sender ID.</p></div>
      <Announce hostels={hostels ?? []} templates={templates ?? []} />
      <section><h2 className="font-semibold">Scheduled</h2>
        <ul className="mt-2 divide-y rounded border text-sm">{(scheduled ?? []).length === 0 && <li className="p-3">Nothing scheduled.</li>}
          {(scheduled ?? []).map((s: { id: string; title: string; send_at: string; channels: string[] }) => (
            <li key={s.id} className="flex items-center justify-between gap-3 p-3"><span>{s.title} · {new Date(s.send_at).toLocaleString("en-NG")} · {s.channels.join(", ")}</span>
              <RpcForm fn="cancel_scheduled" hidden={{ p_id: s.id }} fields={[]} button="Cancel" /></li>))}</ul></section>
      <p className="text-sm"><Link href="/staff/outbox" className="text-[#0b5c36] underline">Delivery queue →</Link></p>
    </main>
  );
}
