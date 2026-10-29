import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import RpcForm from "@/components/RpcForm";

export const metadata = { title: "Allocation tools" };

export default async function Page() {
  const { db } = await requireRole(["hostel_officer"], "/staff/allocation");
  const { data: cur } = await db.from("hostel_sessions").select("id,academic_session").eq("is_current", true).maybeSingle();
  let ready = 0, waitlisted = 0, free = 0;
  if (cur) {
    const a = await db.from("hostel_applications").select("id", { count: "exact", head: true }).eq("session_id", cur.id).in("status", ["submitted", "eligible"]);
    const w = await db.from("hostel_applications").select("id", { count: "exact", head: true }).eq("session_id", cur.id).eq("status", "waitlisted");
    ready = a.count ?? 0; waitlisted = w.count ?? 0;
  }
  const { count: beds } = await db.from("bed_spaces").select("id", { count: "exact", head: true });
  const { count: taken } = await db.from("allocations").select("id", { count: "exact", head: true }).eq("status", "active");
  free = (beds ?? 0) - (taken ?? 0);
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div><Link href="/staff" className="text-sm">← Staff tools</Link>
        <h1 className="mt-2 text-2xl font-bold">Allocation tools</h1>
        <p className="text-sm text-gray-700">Session: {cur?.academic_session ?? "none set"} · {ready} applications ready · {waitlisted} waitlisted · {free} free beds</p></div>

      <section className="rounded border p-4">
        <h2 className="font-semibold">Auto-allocate</h2>
        <p className="mb-3 text-sm text-gray-700">Only applications with a verified payment are considered. Order: medical, student-union leaders, other priority, final-year, fresh students, then first come. Hostels match gender, and a student is never put back in a bed they held before. Those who cannot be placed are waitlisted and notified.</p>
        <RpcForm fn="auto_allocate" fields={[]} button="Run allocation" confirmText="Allocate beds to all ready applications now?" />
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold">Swap two students' beds</h2>
        <RpcForm fn="swap_beds" button="Swap beds" confirmText="Swap these two students' beds?" fields={[
          { name: "p_matric_a", label: "First matric number", required: true }, { name: "p_matric_b", label: "Second matric number", required: true }]} />
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold">Priority category</h2>
        <RpcForm fn="set_priority" button="Save" fields={[
          { name: "p_matric", label: "Matric number", required: true },
          { name: "p_category", label: "Category", type: "select", options: [["none", "None"], ["medical", "Medical"], ["union_leader", "Students' Union leader"], ["other", "Other (approved)"]] }]} />
      </section>
    </main>
  );
}
