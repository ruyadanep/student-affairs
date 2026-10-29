import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/staffGuard";
import RpcForm from "@/components/RpcForm";

export const dynamic = "force-dynamic";
const t = (s: string) => new Date(s).toLocaleString("en-NG");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db, roles } = await requireRole(["dean_office", "hostel_officer", "welfare_officer", "clearance_officer", "org_officer"], `/staff/cases/${id}`);
  const dean = roles.includes("dean_office") || roles.includes("super_admin");
  const { data: c } = await db.from("discipline_cases").select("id,case_no,category,summary,status,notified_at,profiles:student_id(full_name,matric_no)").eq("id", id).maybeSingle();
  if (!c) notFound();
  await db.rpc("log_event", { p_action: "read_case", p_entity: "discipline_cases", p_meta: { case_id: id } });
  const [ev, hr, sn, ap] = await Promise.all([
    db.from("case_events").select("id,note,visible_to_student,created_at").eq("case_id", id).order("created_at"),
    db.from("case_hearings").select("id,scheduled_at,venue").eq("case_id", id).order("scheduled_at"),
    db.from("case_sanctions").select("id,kind,details,ends_on").eq("case_id", id),
    db.from("case_appeals").select("id,grounds,status,decision_note").eq("case_id", id).order("created_at"),
  ]);
  const st = c.profiles as unknown as { full_name: string; matric_no: string | null } | { full_name: string; matric_no: string | null }[] | null;
  const s = Array.isArray(st) ? st[0] : st;
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 text-sm">
      <Link href="/staff/cases" className="text-[#0b5c36] underline">← Cases</Link>
      <h1 className="text-2xl font-bold">{c.case_no} <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-normal">{c.status}</span></h1>
      <p>{s?.full_name} ({s?.matric_no}) · {c.category}</p><p className="rounded border p-3">{c.summary}</p>
      <p>Student notified: {c.notified_at ? t(c.notified_at) : "not yet"}</p>

      <section><h2 className="font-semibold">Timeline</h2>
        <ul className="mt-2 space-y-2">{(ev.data ?? []).map((e: { id: string; note: string; visible_to_student: boolean; created_at: string }) => <li key={e.id} className="rounded border p-2">{e.note}<span className="block text-xs text-gray-600">{t(e.created_at)} · {e.visible_to_student ? "student can see" : "staff only"}</span></li>)}</ul>
        <div className="mt-3"><RpcForm fn="add_case_event" hidden={{ p_case: id }} button="Add note" fields={[{ name: "p_note", label: "Note", type: "textarea", required: true }, { name: "p_visible", label: "Student can see this note", type: "checkbox" }]} /></div></section>

      <section><h2 className="font-semibold">Hearings</h2>
        <ul className="mt-2">{(hr.data ?? []).map((h: { id: string; scheduled_at: string; venue: string }) => <li key={h.id}>{t(h.scheduled_at)} · {h.venue}</li>)}</ul>
        {dean && <div className="mt-3"><RpcForm fn="schedule_hearing" hidden={{ p_case: id }} button="Schedule hearing" fields={[{ name: "p_at", label: "Date and time", type: "datetime-local", required: true }, { name: "p_venue", label: "Venue", required: true }]} /></div>}</section>

      <section><h2 className="font-semibold">Sanctions</h2>
        <ul className="mt-2">{(sn.data ?? []).map((x: { id: string; kind: string; details: string | null; ends_on: string | null }) => <li key={x.id}>{x.kind}{x.details ? `: ${x.details}` : ""}{x.ends_on ? ` (until ${x.ends_on})` : ""}</li>)}</ul>
        {dean && <div className="mt-3"><RpcForm fn="add_sanction" hidden={{ p_case: id }} button="Record sanction" fields={[{ name: "p_kind", label: "Sanction", required: true }, { name: "p_details", label: "Details" }, { name: "p_ends", label: "Ends on", type: "date" }]} /></div>}</section>

      <section><h2 className="font-semibold">Appeals</h2>
        {(ap.data ?? []).map((a: { id: string; grounds: string; status: string; decision_note: string | null }) => (<div key={a.id} className="mt-2 rounded border p-3"><p>{a.grounds}</p><p className="text-xs">Status: {a.status}{a.decision_note ? ` · ${a.decision_note}` : ""}</p>
          {dean && a.status === "submitted" && <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <RpcForm fn="decide_appeal" hidden={{ p_appeal: a.id, p_uphold: true }} button="Uphold" fields={[{ name: "p_note", label: "Reason", required: true }]} />
            <RpcForm fn="decide_appeal" hidden={{ p_appeal: a.id, p_uphold: false }} button="Dismiss" fields={[{ name: "p_note", label: "Reason", required: true }]} /></div>}</div>))}</section>

      {dean && (<section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded border p-3"><h3 className="mb-2 font-semibold">Assign staff</h3><RpcForm fn="assign_case" hidden={{ p_case: id }} button="Assign" fields={[{ name: "p_email", label: "Staff email", required: true }]} /></div>
        <div className="space-y-3 rounded border p-3"><h3 className="font-semibold">Case actions</h3>
          {!c.notified_at && <RpcForm fn="notify_student_of_case" hidden={{ p_case: id }} button="Notify the student" fields={[]} confirmText="The student will be able to read this case. Continue?" />}
          <RpcForm fn="set_case_status" hidden={{ p_case: id }} button="Update status" fields={[{ name: "p_status", label: "Status", type: "select", options: [["open", "Open"], ["hearing", "Hearing"], ["decided", "Decided"], ["appealed", "Appealed"], ["closed", "Closed"]] }]} /></div></section>)}
    </main>
  );
}
