"use client";
import { useState } from "react";
async function call(body: object) { const r = await fetch("/api/staff/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); return { ok: r.ok, j: await r.json() }; }
export function RoleChip({ userId, role, canEdit }: { userId: string; role: string; canEdit: boolean }) {
  async function remove() { if (!confirm(`Remove ${role.replace("_", " ")}?`)) return; const r = await call({ action: "remove_role", user_id: userId, role }); if (r.ok) location.reload(); else alert(r.j.error); }
  return <span className="badge" style={{ marginRight: ".3rem" }}>{role.replace("_", " ")}{canEdit && <button onClick={remove} aria-label={`Remove ${role}`} style={{ background: "none", border: 0, color: "#fff", cursor: "pointer", marginLeft: ".3rem", padding: 0 }}>×</button>}</span>;
}
export function ActiveToggle({ userId, active }: { userId: string; active: boolean }) {
  async function go() { if (active && !confirm("Deactivate this account? They will not be able to sign in.")) return; const r = await call({ action: "set_active", user_id: userId, active: !active }); if (r.ok) location.reload(); else alert(r.j.error); }
  return <button className="btn-outline" onClick={go}>{active ? "Deactivate" : "Reactivate"}</button>;
}
export function AddRole({ units }: { units: [string, string][] }) {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false); const [role, setRole] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)); const r = await call({ action: "add_role", ...f }); setOk(r.ok); setMsg(r.ok ? "Role added." : r.j.error); if (r.ok) setTimeout(() => location.reload(), 600); }
  return (<form className="card" onSubmit={submit}><h3 style={{ marginTop: 0 }}>Give someone a role</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(14rem,1fr))", gap: "0 1rem" }}>
      <label>Their account email<input className="field" name="email" type="email" required /></label>
      <label>Role<select className="field" name="role" required value={role} onChange={(e) => setRole(e.target.value)}><option value="">Select</option><option value="hostel_officer">Hostel officer</option><option value="clearance_officer">Clearance officer</option><option value="org_officer">Organisations officer</option><option value="welfare_officer">Welfare officer</option><option value="dean_office">Dean's office</option><option value="super_admin">Super admin</option></select></label>
      {role === "clearance_officer" && <label>Clearance unit<select className="field" name="unit_id"><option value="">Select</option>{units.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>}</div>
    <button className="btn" type="submit">Add role</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</form>);
}
