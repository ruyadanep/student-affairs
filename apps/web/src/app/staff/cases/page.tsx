import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import RpcForm from "@/components/RpcForm";

export const metadata = { title: "Discipline cases" };
type C = { id: string; case_no: string; category: string; status: string; created_at: string; profiles: { full_name: string; matric_no: string | null } | { full_name: string; matric_no: string | null }[] | null };

export default async function Page() {
  const { db, roles } = await requireRole(["dean_office", "hostel_officer", "welfare_officer", "clearance_officer", "org_officer"], "/staff/cases");
  const dean = roles.includes("dean_office") || roles.includes("super_admin");
  const { data } = await db.from("discipline_cases").select("id,case_no,category,status,created_at,profiles:student_id(full_name,matric_no)").order("created_at", { ascending: false });
  const { data: holds } = await db.from("clearance_holds").select("id,reason,placed_at,profiles:student_id(full_name,matric_no)").is("lifted_at", null);
  const pr = (p: C["profiles"]) => (Array.isArray(p) ? p[0] : p);
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <Link href="/staff" className="text-sm">← Staff tools</Link>
      <h1 className="text-2xl font-bold">Discipline cases</h1>
      <p className="rounded bg-amber-50 p-3 text-sm text-amber-900">Confidential. Every time you open a case it is recorded in the audit log.</p>
      {dean && <section className="rounded border p-4"><h2 className="mb-2 font-semibold">Open a case</h2>
        <RpcForm fn="open_case" button="Open case" fields={[{ name: "p_matric", label: "Student matric number", required: true }, { name: "p_category", label: "Category (e.g. examination, hostel, conduct)", required: true }, { name: "p_summary", label: "Summary", type: "textarea", required: true }]} /></section>}
      <ul className="divide-y rounded border text-sm">
        {(data ?? []).length === 0 && <li className="p-3">No cases you can see.</li>}
        {((data ?? []) as unknown as C[]).map((c) => (<li key={c.id} className="p-3"><Link href={`/staff/cases/${c.id}`} className="font-semibold">{c.case_no}</Link> · {pr(c.profiles)?.full_name} ({pr(c.profiles)?.matric_no}) · {c.category} · <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{c.status}</span></li>))}
      </ul>
      {dean && <section><h2 className="mb-2 font-semibold">Clearance holds</h2>
        <ul className="divide-y rounded border text-sm">{(holds ?? []).length === 0 && <li className="p-3">No active holds.</li>}
          {((holds ?? []) as unknown as { id: string; reason: string; profiles: C["profiles"] }[]).map((h) => (<li key={h.id} className="flex items-center justify-between gap-3 p-3"><span>{pr(h.profiles)?.full_name} ({pr(h.profiles)?.matric_no}): {h.reason}</span><RpcForm fn="lift_hold" hidden={{ p_hold: h.id }} fields={[]} button="Lift" confirmText="Lift this hold?" /></li>))}</ul>
        <div className="mt-4 rounded border p-4"><h3 className="mb-2 font-semibold">Place a hold</h3>
          <RpcForm fn="place_hold" hidden={{ p_case: null }} button="Place hold" fields={[{ name: "p_matric", label: "Matric number", required: true }, { name: "p_reason", label: "Reason (the student can see this, so keep it brief)", required: true }]} /></div></section>}
    </main>
  );
}
