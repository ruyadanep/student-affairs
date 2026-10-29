import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import RpcForm from "@/components/RpcForm";

export const metadata = { title: "Bulk clearance approval" };

export default async function Page() {
  const { db, user } = await requireRole(["clearance_officer"], "/staff/clearance-bulk");
  const { data: mine } = await db.from("unit_officers").select("unit_id, clearance_units(name)").eq("user_id", user.id);
  const units = (mine ?? []) as unknown as { unit_id: string; clearance_units: { name: string } | { name: string }[] | null }[];
  const nm = (u: (typeof units)[number]) => (Array.isArray(u.clearance_units) ? u.clearance_units[0]?.name : u.clearance_units?.name) ?? "Unit";
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/staff/clearance" className="text-sm">← Clearance</Link>
      <h1 className="mt-2 text-2xl font-bold">Bulk approval</h1>
      <p className="mt-2 text-sm text-gray-700">Approves every student waiting at your unit whose earlier units have already cleared them. Students who were returned or blocked are left alone. Each approval is audit-logged.</p>
      {units.length === 0 && <p className="mt-4 text-sm">You are not assigned to a clearance unit. Ask the Dean's office.</p>}
      {units.map((u) => (
        <section key={u.unit_id} className="mt-4 rounded border p-4">
          <h2 className="font-semibold">{nm(u)}</h2>
          <RpcForm fn="approve_ready_steps" hidden={{ p_unit: u.unit_id }} fields={[]} button="Approve all ready" confirmText="Approve every ready student at this unit?" />
        </section>
      ))}
    </main>
  );
}
