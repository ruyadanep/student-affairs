import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";

export const metadata = { title: "Workload and overdue items" };
const days = (iso: string | null) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) : 0);

type W = { tickets: { name: string; open: number; oldest: string }[]; clearance: { unit: string; pending: number; oldest: string }[]; documents: number; room_changes: number };

export default async function Page() {
  const { db } = await requireRole(["dean_office", "hostel_officer"], "/staff/workload");
  const { data } = await db.rpc("staff_workload");
  const { data: set } = await db.from("app_settings").select("value").eq("key", "overdue_days").maybeSingle();
  const limit = Number(set?.value) || 3;
  const w = (data ?? { tickets: [], clearance: [], documents: 0, room_changes: 0 }) as W;
  const flag = (d: number) => (d > limit ? <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">overdue</span> : null);
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div><Link href="/staff" className="text-sm">← Staff tools</Link>
        <h1 className="mt-2 text-2xl font-bold">Workload and overdue items</h1>
        <p className="text-sm text-gray-700">Anything waiting more than {limit} days is flagged.</p></div>
      <section><h2 className="font-semibold">Maintenance tickets by assignee</h2>
        <ul className="mt-2 divide-y rounded border text-sm">{w.tickets.length === 0 && <li className="p-3">Nothing open.</li>}
          {w.tickets.map((t, i) => <li key={i} className="p-3">{t.name}: <b>{t.open}</b> open, oldest {days(t.oldest)} days {flag(days(t.oldest))}</li>)}</ul></section>
      <section><h2 className="font-semibold">Clearance waiting by unit</h2>
        <ul className="mt-2 divide-y rounded border text-sm">{w.clearance.length === 0 && <li className="p-3">Nothing waiting.</li>}
          {w.clearance.map((c, i) => <li key={i} className="p-3">{c.unit}: <b>{c.pending}</b> waiting, oldest {days(c.oldest)} days {flag(days(c.oldest))}</li>)}</ul></section>
      <p className="text-sm">Letter requests waiting: <b>{w.documents}</b> · Room-change requests waiting: <b>{w.room_changes}</b></p>
    </main>
  );
}
