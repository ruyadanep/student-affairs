import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import SetupForms from "./SetupForms";
export const metadata = { title: "Setup" };
export default async function Setup() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["hostel_officer", "dean_office", "super_admin"]);
  if (!roles?.length) return <main><h1>Setup</h1><p>This page is for hostel office and Dean's office staff.</p></main>;
  const { data: hostels } = await db.from("hostels").select("id,name,gender,fee,rooms(id,bed_spaces(count))").order("name");
  const { data: units } = await db.from("clearance_units").select("id,name,sequence").order("sequence");
  const { data: sessions } = await db.from("hostel_sessions").select("academic_session,is_current,opens_at,closes_at").order("created_at", { ascending: false });
  const beds = (h: any) => (h.rooms ?? []).reduce((n: number, r: any) => n + (r.bed_spaces?.[0]?.count ?? 0), 0);
  return (<main><h1>Setup</h1>
    <SetupForms hostels={(hostels ?? []).map((h) => [h.id, h.name])} units={(units ?? []).map((u) => [u.id, u.name])} />
    <h2>Hostels</h2>
    <div className="table-scroll"><table><thead><tr><th>Hostel</th><th>Gender</th><th>Rooms</th><th>Beds</th></tr></thead><tbody>
      {(hostels ?? []).map((h: any) => <tr key={h.id}><td>{h.name}</td><td>{h.gender}</td><td>{h.rooms?.length ?? 0}</td><td>{beds(h)}</td></tr>)}
      {!hostels?.length && <tr><td colSpan={4}>No hostels yet.</td></tr>}</tbody></table></div>
    <h2>Sessions</h2>
    <div className="table-scroll"><table><thead><tr><th>Session</th><th>Status</th></tr></thead><tbody>
      {(sessions ?? []).map((s) => <tr key={s.academic_session}><td>{s.academic_session}</td><td>{s.is_current ? <span className="badge">Current</span> : "Past"}</td></tr>)}
      {!sessions?.length && <tr><td colSpan={2}>No sessions yet.</td></tr>}</tbody></table></div>
    <h2>Clearance units</h2>
    <ol>{(units ?? []).map((u) => <li key={u.id}>{u.name}</li>)}{!units?.length && <li>No units yet.</li>}</ol>
  </main>);
}
