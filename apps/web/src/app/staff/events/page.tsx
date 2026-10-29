import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import RpcForm from "@/components/RpcForm";

export const metadata = { title: "Event requests" };

export default async function Page() {
  const { db } = await requireRole(["dean_office", "org_officer"], "/staff/events");
  const { data: reqs } = await db.from("events").select("id,title,venue,starts_at,description,profiles:requested_by(full_name)").eq("status", "requested").order("created_at");
  const { data: upcoming } = await db.from("events").select("id,title,starts_at").eq("status", "approved").gte("starts_at", new Date(Date.now() - 86400000).toISOString()).order("starts_at");
  type R = { id: string; title: string; venue: string; starts_at: string; description: string | null; profiles: { full_name: string } | { full_name: string }[] | null };
  const who = (r: R) => (Array.isArray(r.profiles) ? r.profiles[0]?.full_name : r.profiles?.full_name) ?? "A student";
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <Link href="/staff" className="text-sm text-[#0b5c36] underline">← Staff tools</Link>
      <h1 className="text-2xl font-bold">Event requests</h1>
      <ul className="space-y-3">
        {(reqs ?? []).length === 0 && <li className="text-sm">Nothing waiting.</li>}
        {((reqs ?? []) as unknown as R[]).map((r) => (
          <li key={r.id} className="rounded border p-4 text-sm">
            <p className="font-semibold">{r.title}</p>
            <p>{who(r)} · {r.venue} · {new Date(r.starts_at).toLocaleString("en-NG")}</p>
            {r.description && <p className="mt-1">{r.description}</p>}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <RpcForm fn="decide_event" hidden={{ p_id: r.id, p_approve: true }} fields={[]} button="Approve" />
              <RpcForm fn="decide_event" hidden={{ p_id: r.id, p_approve: false }} fields={[{ name: "p_note", label: "Reason for declining", required: true }]} button="Decline" />
            </div>
          </li>))}
      </ul>
      <section><h2 className="font-semibold">Check people in</h2>
        <p className="mb-2 text-sm text-gray-700">Type the student's matric number at the door.</p>
        <RpcForm fn="checkin_event" onDone="none" button="Check in" fields={[
          { name: "p_event", label: "Event", type: "select", options: (upcoming ?? []).map((u: { id: string; title: string }) => [u.id, u.title] as [string, string]) },
          { name: "p_matric", label: "Matric number", required: true }]} /></section>
    </main>
  );
}
