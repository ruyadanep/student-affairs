import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import RpcForm from "@/components/RpcForm";
import Anonymise from "./Anonymise";

export const metadata = { title: "Data protection requests" };

export default async function Page() {
  const { db, roles } = await requireRole(["dean_office"], "/staff/privacy");
  const sa = roles.includes("super_admin");
  const { data } = await db.from("data_requests").select("id,kind,details,status,created_at,profiles:student_id(full_name,matric_no)").order("created_at", { ascending: false }).limit(50);
  type R = { id: string; kind: string; details: string; status: string; profiles: { full_name: string; matric_no: string | null } | { full_name: string; matric_no: string | null }[] | null };
  const who = (r: R) => { const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles; return `${p?.full_name} (${p?.matric_no})`; };
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 text-sm">
      <Link href="/staff" className="text-[#0b5c36] underline">← Staff tools</Link>
      <h1 className="text-2xl font-bold">Data protection requests</h1>
      <ul className="space-y-3">{((data ?? []) as unknown as R[]).map((r) => (
        <li key={r.id} className="rounded border p-3"><p><b>{r.kind}</b> · {who(r)} · {r.status}</p><p className="mt-1">{r.details}</p>
          {r.status === "submitted" && <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <RpcForm fn="decide_data_request" hidden={{ p_id: r.id, p_done: true }} button="Mark done" fields={[{ name: "p_note", label: "Note to student", required: true }]} />
            <RpcForm fn="decide_data_request" hidden={{ p_id: r.id, p_done: false }} button="Decline" fields={[{ name: "p_note", label: "Reason", required: true }]} /></div>}</li>))}
        {(data ?? []).length === 0 && <li>No requests.</li>}</ul>
      {sa && <section className="rounded border p-4"><h2 className="mb-2 font-semibold">Anonymise a student (super admin)</h2>
        <p className="mb-3">Removes name, email, phone and login. Allocation, clearance and audit records stay under a pseudonym. Blocked while the student holds a bed or has an active hold.</p><Anonymise /></section>}
    </main>
  );
}
