import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
export const metadata = { title: "Audit log" };
const PAGE = 50;
const entities = ["allocations", "payment_records", "clearance_steps", "document_requests", "organisations", "support_requests", "user_roles", "report"];
export default async function Audit({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/staff/audit");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["dean_office", "super_admin"]);
  if (!roles?.length) return <main><h1>Audit log</h1><p>The audit log is for the Dean's office.</p></main>;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  let q = db.from("audit_log").select("id,actor,action,entity,entity_id,meta,created_at", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * PAGE, page * PAGE - 1);
  if (sp.entity) q = q.eq("entity", sp.entity); if (sp.action) q = q.eq("action", sp.action.toLowerCase().replace(/[^a-z_]/g, ""));
  if (sp.from) q = q.gte("created_at", new Date(sp.from).toISOString()); if (sp.to) q = q.lt("created_at", new Date(new Date(sp.to).getTime() + 86400000).toISOString());
  if (sp.who) { const { data: ps } = await db.from("profiles").select("id").ilike("email", `%${sp.who.replace(/[%,]/g, "")}%`).limit(50); q = q.in("actor", (ps ?? []).map((p) => p.id).concat(["00000000-0000-0000-0000-000000000000"])); }
  const { data: rows, count } = await q;
  const ids = [...new Set((rows ?? []).map((r) => r.actor).filter(Boolean))] as string[];
  const { data: people } = ids.length ? await db.from("profiles").select("id,full_name,email").in("id", ids) : { data: [] as any[] };
  const who = (id: string | null) => { const p = (people ?? []).find((x: any) => x.id === id); return p ? `${p.full_name} (${p.email})` : id ? id.slice(0, 8) : "System"; };
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE));
  const qs = (p: number) => new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([, v]) => v) as [string, string][]), page: String(p) }).toString();
  return (<main><h1>Audit log</h1><p>A record of who did what on important decisions. Entries cannot be edited from the site.</p>
    <form method="get" className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(11rem,1fr))", gap: "0 1rem", alignItems: "end" }}>
      <label>Area<select className="field" name="entity" defaultValue={sp.entity ?? ""}><option value="">All</option>{entities.map((e) => <option key={e}>{e}</option>)}</select></label>
      <label>Action<input className="field" name="action" defaultValue={sp.action ?? ""} placeholder="update, insert, export" /></label>
      <label>Person (email)<input className="field" name="who" defaultValue={sp.who ?? ""} /></label>
      <label>From<input className="field" type="date" name="from" defaultValue={sp.from ?? ""} /></label><label>To<input className="field" type="date" name="to" defaultValue={sp.to ?? ""} /></label>
      <div><button className="btn" type="submit" style={{ marginBottom: "1rem" }}>Filter</button></div></form>
    <p><small>{count ?? 0} entries · page {page} of {pages}</small></p>
    <div className="table-scroll"><table><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Area</th><th>Details</th></tr></thead><tbody>
      {(rows ?? []).map((r) => (<tr key={r.id}><td style={{ whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleString("en-GB", { timeZone: "Africa/Lagos" })}</td><td>{who(r.actor)}</td><td>{r.action}</td><td>{r.entity}{r.entity_id ? <><br /><small>{r.entity_id.slice(0, 8)}</small></> : null}</td>
        <td><details style={{ border: 0, padding: 0, margin: 0 }}><summary>View</summary><pre style={{ whiteSpace: "pre-wrap", fontSize: ".8rem", margin: ".4rem 0 0" }}>{JSON.stringify(r.meta, null, 2)}</pre></details></td></tr>))}
      {!rows?.length && <tr><td colSpan={5}>No entries match.</td></tr>}</tbody></table></div>
    <p>{page > 1 && <a href={`?${qs(page - 1)}`}>Newer</a>}{page > 1 && page < pages && " · "}{page < pages && <a href={`?${qs(page + 1)}`}>Older</a>}</p></main>);
}
