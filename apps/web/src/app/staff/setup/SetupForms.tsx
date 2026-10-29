"use client";
import { useState } from "react";
type Field = { name: string; label: string; type?: string; options?: [string, string][]; placeholder?: string; required?: boolean };
function Form({ action, title, fields, button }: { action: string; title: string; fields: Field[]; button: string }) {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/staff/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...f }) });
    const j = await r.json(); setOk(r.ok); setMsg(j.error ?? "Saved."); if (r.ok) setTimeout(() => location.reload(), 700);
  }
  return (<form className="card" onSubmit={submit}><h3 style={{ marginTop: 0 }}>{title}</h3>
    {fields.map((f) => f.type === "checkbox" ? (<label key={f.name} style={{ display: "block", marginBottom: ".9rem" }}><input type="checkbox" name={f.name} /> {f.label}</label>)
      : f.options ? (<label key={f.name}>{f.label}<select className="field" name={f.name} required={f.required}><option value="">Select</option>{f.options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>)
      : (<label key={f.name}>{f.label}<input className="field" name={f.name} type={f.type ?? "text"} placeholder={f.placeholder} required={f.required} /></label>))}
    <button className="btn" type="submit">{button}</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</form>);
}
export default function SetupForms({ hostels, units }: { hostels: [string, string][]; units: [string, string][] }) {
  return (<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(18rem,1fr))", gap: "1rem" }}>
    <Form action="create_session" title="Hostel session" button="Save session" fields={[
      { name: "academic_session", label: "Session", placeholder: "2026/2027", required: true }, { name: "opens_at", label: "Applications open", type: "datetime-local" },
      { name: "closes_at", label: "Applications close", type: "datetime-local" }, { name: "fresh_and_final_only", label: "Fresh and final-year students only", type: "checkbox" }, { name: "make_current", label: "Make this the current session", type: "checkbox" }]} />
    <Form action="create_hostel" title="Add a hostel" button="Add hostel" fields={[
      { name: "name", label: "Name", required: true }, { name: "gender", label: "Gender", required: true, options: [["male", "Male"], ["female", "Female"], ["mixed", "Mixed"]] }, { name: "fee", label: "Fee (naira, optional)", type: "number" }]} />
    <Form action="add_rooms" title="Add rooms and beds" button="Add rooms" fields={[
      { name: "hostel_id", label: "Hostel", required: true, options: hostels }, { name: "block", label: "Block (optional)", placeholder: "A" },
      { name: "from", label: "First room number", type: "number", required: true }, { name: "to", label: "Last room number", type: "number", required: true }, { name: "beds", label: "Beds per room", type: "number", required: true }]} />
    <Form action="add_unit" title="Add a clearance unit" button="Add unit" fields={[{ name: "name", label: "Unit name", placeholder: "Library", required: true }, { name: "sequence", label: "Order (1 clears first)", type: "number", required: true }]} />
    <Form action="assign_role" title="Give a staff role" button="Assign role" fields={[
      { name: "email", label: "Their account email", type: "email", required: true },
      { name: "role", label: "Role", required: true, options: [["hostel_officer", "Hostel officer"], ["clearance_officer", "Clearance officer"], ["org_officer", "Organisations officer"], ["welfare_officer", "Welfare officer"], ["dean_office", "Dean's office"], ["super_admin", "Super admin"]] },
      { name: "unit_id", label: "Clearance unit (clearance officers only)", options: units }]} />
  </div>);
}
