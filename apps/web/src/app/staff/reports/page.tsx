import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import PrintButton from "./PrintButton";
export const metadata = { title: "Reports" };
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
const num = (n: unknown) => (n == null ? "fewer than 5" : String(n));
const sum = (o: Record<string, number> | undefined) => Object.values(o ?? {}).reduce((a, b) => a + Number(b), 0);
export default async function Reports() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/staff/reports");
  const { data: r, error } = await db.rpc("report_overview");
  if (error || !r) return <main><h1>Reports</h1><p>Reports are for the Dean's office and hostel office.</p></main>;
  const beds = r.occupancy.reduce((a: number, h: any) => a + h.beds, 0), used = r.occupancy.reduce((a: number, h: any) => a + h.occupied, 0);
  const worst = [...r.clearance_units].sort((a: any, b: any) => b.pending - a.pending)[0];
  const stat = (label: string, value: string, note?: string) => (<div className="card" style={{ margin: 0 }}><small>{label}</small><div style={{ fontSize: "1.9rem", fontFamily: "var(--font-head)", color: "var(--brand)" }}>{value}</div>{note && <small>{note}</small>}</div>);
  return (<main><div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
      <div><h1>Reports</h1><p style={{ margin: 0 }}>Session {r.session ?? "none set"} · generated {new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" })}</p></div>
      <div className="no-print" style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><PrintButton /></div></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(11rem,1fr))", gap: "1rem", margin: "1.5rem 0" }}>
      {stat("Beds occupied", `${used} / ${beds}`, `${pct(used, beds)}% full`)}{stat("Hostel applications", String(sum(r.pipeline)), r.avg_days_to_allocation != null ? `${r.avg_days_to_allocation} days to allocate` : undefined)}
      {stat("Students cleared", String(r.clearance.cleared ?? 0), `${r.clearance.in_progress ?? 0} in progress`)}{stat("Accounts created", `${pct(r.adoption.registered, r.adoption.total)}%`, `${r.adoption.registered} of ${r.adoption.total} students`)}</div>

    <h2>Hostel occupancy</h2>
    <div className="table-scroll"><table><thead><tr><th>Hostel</th><th>Beds</th><th>Occupied</th><th>Vacant</th><th>Filled</th></tr></thead><tbody>
      {r.occupancy.map((h: any) => (<tr key={h.name}><td>{h.name} <small>({h.gender})</small></td><td>{h.beds}</td><td>{h.occupied}</td><td>{h.beds - h.occupied}</td><td style={{ minWidth: "9rem" }}><div className="meter" role="img" aria-label={`${pct(h.occupied, h.beds)} percent filled`}><span style={{ width: `${pct(h.occupied, h.beds)}%` }} /></div></td></tr>))}
      {!r.occupancy.length && <tr><td colSpan={5}>No hostels yet.</td></tr>}</tbody></table></div>
    <p className="no-print"><a href="/api/staff/reports/export?type=occupancy">Export occupancy (CSV)</a> · <a href="/api/staff/reports/export?type=hostel_applications">Export hostel applications (CSV)</a></p>

    <h2>Hostel applications this session</h2>
    <div className="table-scroll"><table><thead><tr><th>Stage</th><th>Students</th></tr></thead><tbody>
      {[["submitted", "Waiting for payment check"], ["eligible", "Payment confirmed"], ["allocated", "Room allocated"], ["waitlisted", "Waiting list"], ["rejected", "Not successful"]].map(([k, l]) => <tr key={k}><td>{l}</td><td>{r.pipeline[k] ?? 0}</td></tr>)}</tbody></table></div>

    <h2>Clearance by unit</h2>
    {worst?.pending > 0 && <p>Biggest backlog: <strong>{worst.name}</strong> with {worst.pending} waiting.</p>}
    <div className="table-scroll"><table><thead><tr><th>Unit</th><th>Waiting</th><th>Average days to approve</th></tr></thead><tbody>
      {r.clearance_units.map((u: any) => <tr key={u.name}><td>{u.name}</td><td>{u.pending}</td><td>{u.avg_days ?? "-"}</td></tr>)}
      {!r.clearance_units.length && <tr><td colSpan={3}>No clearance units yet.</td></tr>}</tbody></table></div>
    <p className="no-print"><a href="/api/staff/reports/export?type=clearance">Export clearance (CSV)</a></p>

    <h2>Service times</h2>
    <div className="table-scroll"><table><thead><tr><th>Service</th><th>Counts</th><th>Average</th></tr></thead><tbody>
      <tr><td>Letters</td><td>{Object.entries(r.letters.by_status).map(([k, v]) => `${k}: ${v}`).join(", ") || "none yet"}</td><td>{r.letters.avg_hours_to_issue != null ? `${r.letters.avg_hours_to_issue} hours to issue` : "-"}</td></tr>
      <tr><td>Maintenance</td><td>{Object.entries(r.tickets.by_status).map(([k, v]) => `${k.replace("_", " ")}: ${v}`).join(", ") || "none yet"}</td><td>{r.tickets.avg_days_to_fix != null ? `${r.tickets.avg_days_to_fix} days to fix` : "-"}</td></tr></tbody></table></div>
    {Object.keys(r.tickets.open_by_category).length > 0 && <p>Open faults by type: {Object.entries(r.tickets.open_by_category).map(([k, v]) => `${k} (${v})`).join(", ")}</p>}
    <p className="no-print"><a href="/api/staff/reports/export?type=maintenance">Export maintenance (CSV)</a></p>

    <h2>Account sign-ups by faculty</h2>
    <div className="table-scroll"><table><thead><tr><th>Faculty</th><th>On the list</th><th>Have accounts</th><th>Share</th></tr></thead><tbody>
      {r.adoption.by_faculty.map((f: any) => <tr key={f.faculty}><td>{f.faculty}</td><td>{f.total}</td><td>{f.registered}</td><td>{pct(f.registered, f.total)}%</td></tr>)}
      {!r.adoption.by_faculty.length && <tr><td colSpan={4}>Import the student list to see this.</td></tr>}</tbody></table></div>

    {r.support && (<><h2>Welfare requests (counts only)</h2>
      <p><small>Groups smaller than 5 are hidden to protect privacy.</small></p>
      <div className="table-scroll"><table><thead><tr><th>Type</th><th>Requests</th><th>Resolved or closed</th></tr></thead><tbody>
        {r.support.map((s: any) => <tr key={s.kind}><td>{s.kind.replace("_", " ")}</td><td>{num(s.total)}</td><td>{num(s.resolved)}</td></tr>)}
        {!r.support.length && <tr><td colSpan={3}>No requests yet.</td></tr>}</tbody></table></div></>)}
    <p className="no-print" style={{ marginTop: "1.5rem" }}><a href="/api/staff/reports/export?type=students">Export student list (CSV, Dean's office)</a></p>
  </main>);
}
