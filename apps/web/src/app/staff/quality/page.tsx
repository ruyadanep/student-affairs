import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
export const metadata = { title: "Data quality" };
type Check = { title: string; fix: string; issues: number; sample: string[] };
export default async function Quality() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/staff/quality");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["dean_office", "super_admin"]);
  if (!roles?.length) return <main><h1>Data quality</h1><p>This page is for the Dean's office.</p></main>;
  const missing = async (title: string, fix: string, filter: (q: any) => any): Promise<Check> => { const { data, count } = await filter(db.from("enrolled_students").select("matric_no", { count: "exact" })).limit(5); return { title, fix, issues: count ?? 0, sample: (data ?? []).map((r: any) => r.matric_no) }; };
  const checks: Check[] = await Promise.all([
    missing("Students on the list with no gender", "Hostel allocation needs gender. Re-import with the gender column filled in.", (q) => q.is("gender", null)),
    missing("Students with no faculty or department", "Needed for reports and targeted announcements.", (q) => q.or("faculty.is.null,department.is.null")),
    missing("Students with no level", "Needed to send announcements by level.", (q) => q.is("level", null)),
  ]);
  const { data: emails } = await db.from("enrolled_students").select("matric_no,email").not("email", "is", null).limit(20000);
  const seen = new Map<string, string[]>(); (emails ?? []).forEach((s: any) => { const k = s.email.toLowerCase(); seen.set(k, [...(seen.get(k) ?? []), s.matric_no]); });
  const dups = [...seen.entries()].filter(([, v]) => v.length > 1);
  checks.push({ title: "Email addresses shared by more than one student", fix: "Students must register with their own email. Correct the list and re-import.", issues: dups.length, sample: dups.slice(0, 5).map(([e, v]) => `${e} (${v.join(", ")})`) });
  const { data: loose } = await db.from("profiles").select("id,email").is("matric_no", null).limit(2000);
  const { data: staffIds } = await db.from("user_roles").select("user_id").neq("role", "student");
  const staffSet = new Set((staffIds ?? []).map((r) => r.user_id)); const orphans = (loose ?? []).filter((p) => !staffSet.has(p.id));
  checks.push({ title: "Student accounts not linked to a matric number", fix: "These accounts signed up without a matching entry on the student list. They can't apply for hostels with correct details.", issues: orphans.length, sample: orphans.slice(0, 5).map((p) => p.email ?? p.id) });
  const { data: units } = await db.from("clearance_units").select("id,name"); const { data: offs } = await db.from("unit_officers").select("unit_id");
  const covered = new Set((offs ?? []).map((o) => o.unit_id)); const bare = (units ?? []).filter((u) => !covered.has(u.id));
  checks.push({ title: "Clearance units with no officer", fix: "Students will be stuck at these units. Assign officers on Users and roles.", issues: bare.length, sample: bare.map((u) => u.name) });
  const { data: rep } = await db.rpc("report_overview"); const empty = (rep?.occupancy ?? []).filter((h: any) => h.beds === 0);
  checks.push({ title: "Hostels with no beds", fix: "Add rooms and beds on Setup.", issues: empty.length, sample: empty.map((h: any) => h.name) });
  checks.push({ title: "No current hostel session", fix: "Set one on Setup or New session.", issues: rep?.session ? 0 : 1, sample: [] });
  const bad = checks.filter((c) => c.issues > 0).length;
  return (<main><h1>Data quality</h1><p>{bad === 0 ? <span className="badge">All checks passed</span> : <span className="badge gold">{bad} {bad === 1 ? "check needs" : "checks need"} attention</span>}</p>
    {checks.map((c) => (<div className="card" key={c.title}><strong>{c.title}</strong> {c.issues === 0 ? <span className="badge">OK</span> : <span className="badge red">{c.issues}</span>}
      {c.issues > 0 && <><p style={{ margin: ".4rem 0 0" }}>{c.fix}</p>{c.sample.length > 0 && <p style={{ margin: ".3rem 0 0" }}><small>Examples: {c.sample.join("; ")}</small></p>}</>}</div>))}</main>);
}
