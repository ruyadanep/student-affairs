import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
export const metadata = { title: "Student lookup" };
export default async function Lookup({ searchParams }: { searchParams: Promise<{ q?: string; id?: string }> }) {
  const sp = await searchParams;
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/staff/lookup");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["dean_office", "hostel_officer", "clearance_officer", "super_admin"]);
  if (!roles?.length) return <main><h1>Student lookup</h1><p>This page is for the Dean's office, hostel office, and clearance officers.</p></main>;
  const id = sp.id && /^[0-9a-f-]{36}$/i.test(sp.id) ? sp.id : null;
  const term = (sp.q ?? "").replace(/[%,()]/g, "").trim();
  const { data: found } = !id && term.length >= 2 ? await db.from("profiles").select("id,full_name,matric_no,email,faculty,department,level").or(`matric_no.ilike.%${term}%,full_name.ilike.%${term}%,email.ilike.%${term}%`).limit(20) : { data: null };
  let detail: any = null;
  if (id) {
    const [p, apps, alloc, clr, docs, tix, orgs] = await Promise.all([
      db.from("profiles").select("*").eq("id", id).maybeSingle(),
      db.from("hostel_applications").select("status,reason,payment_records(reference,status),hostel_sessions(academic_session)").eq("student_id", id).order("created_at", { ascending: false }).limit(3),
      db.from("allocations").select("checked_in_at,bed_spaces(label,rooms(block,room_no,hostels(name))),hostel_applications!inner(student_id)").eq("hostel_applications.student_id", id).eq("status", "active").limit(1).maybeSingle(),
      db.from("clearance_requests").select("status,academic_session,clearance_steps(status,clearance_units(name,sequence))").eq("student_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      db.from("document_requests").select("doc_type,status,created_at").eq("student_id", id).order("created_at", { ascending: false }).limit(10),
      db.from("maintenance_tickets").select("category,status,created_at").eq("reporter_id", id).order("created_at", { ascending: false }).limit(10),
      db.from("organisation_members").select("position,organisations(name)").eq("student_id", id)]);
    if (p.data) { detail = { p: p.data, apps: apps.data, alloc: alloc.data, clr: clr.data, docs: docs.data, tix: tix.data, orgs: orgs.data }; await db.rpc("log_event", { p_action: "student_lookup", p_entity: "profiles", p_meta: { student_id: id } }); }
  }
  const d = detail; const rm = d?.alloc?.bed_spaces?.rooms;
  return (<main><h1>Student lookup</h1>
    <form method="get" style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><input className="field" style={{ margin: 0, flex: "1 1 18rem", width: "auto" }} name="q" defaultValue={sp.q ?? ""} placeholder="Matric number, name, or email" aria-label="Search" /><button className="btn" type="submit">Search</button></form>
    <p><small>Every student record you open is logged.</small></p>
    {found && (<div className="table-scroll"><table><thead><tr><th>Student</th><th>Faculty</th><th>Level</th></tr></thead><tbody>
      {found.map((s) => <tr key={s.id}><td><a href={`?id=${s.id}`}>{s.full_name}</a><br /><small>{s.matric_no ?? s.email}</small></td><td>{s.faculty ?? "-"}</td><td>{s.level ?? "-"}</td></tr>)}
      {!found.length && <tr><td colSpan={3}>No students match.</td></tr>}</tbody></table></div>)}
    {id && !d && <p>Student not found.</p>}
    {d && (<><p><a href="/staff/lookup">New search</a></p>
      <div className="card"><h2 style={{ marginTop: 0 }}>{d.p.full_name}</h2><p style={{ margin: 0 }}>{d.p.matric_no ?? "No matric number"} · {d.p.email}<br /><small>{[d.p.faculty, d.p.department, d.p.level && `${d.p.level} level`, d.p.gender].filter(Boolean).join(" · ")}</small></p></div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Hostel</h3>
        {d.alloc ? <p><span className="badge">Allocated</span> {rm?.hostels?.name}, room {rm?.room_no}{rm?.block ? ` (block ${rm.block})` : ""}, bed {d.alloc.bed_spaces?.label}{d.alloc.checked_in_at ? ` · checked in ${new Date(d.alloc.checked_in_at).toDateString()}` : " · not yet checked in"}</p> : <p>No room allocated.</p>}
        {(d.apps ?? []).map((a: any, i: number) => <p key={i} style={{ margin: ".2rem 0" }}><small>{a.hostel_sessions?.academic_session}: {a.status} · payment {a.payment_records?.status ?? "none"} ({a.payment_records?.reference ?? "-"})</small></p>)}</div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Clearance</h3>
        {d.clr ? <><p><span className={d.clr.status === "cleared" ? "badge" : "badge gold"}>{d.clr.status.replace("_", " ")}</span> <small>{d.clr.academic_session}</small></p>
          <p style={{ margin: 0 }}>{[...d.clr.clearance_steps].sort((a: any, b: any) => a.clearance_units.sequence - b.clearance_units.sequence).map((s: any) => `${s.clearance_units.name}: ${s.status}`).join(" · ")}</p></> : <p>Not started.</p>}</div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Letters, faults, and clubs</h3>
        <p style={{ margin: ".2rem 0" }}><strong>Letters:</strong> {(d.docs ?? []).map((x: any) => `${x.doc_type.replace("_", " ")} (${x.status})`).join(", ") || "none"}</p>
        <p style={{ margin: ".2rem 0" }}><strong>Maintenance:</strong> {(d.tix ?? []).map((x: any) => `${x.category} (${x.status})`).join(", ") || "none"}</p>
        <p style={{ margin: ".2rem 0" }}><strong>Organisations:</strong> {(d.orgs ?? []).map((x: any) => `${x.organisations?.name} (${x.position})`).join(", ") || "none"}</p></div></>)}
  </main>);
}
