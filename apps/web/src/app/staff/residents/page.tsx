import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Actions from "./Actions";
export const metadata = { title: "Residents" };
export default async function Residents() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["hostel_officer", "super_admin"]);
  if (!roles?.length) return <main><h1>Residents</h1><p>This page is for hostel office staff.</p></main>;
  const { data: list } = await db.from("allocations").select("id,checked_in_at,bed_spaces(label,rooms(block,room_no,hostels(name))),hostel_applications(profiles(full_name,matric_no))").eq("status", "active").limit(500);
  const rows = (list ?? []).sort((a: any, b: any) => (a.bed_spaces?.rooms?.hostels?.name ?? "").localeCompare(b.bed_spaces?.rooms?.hostels?.name ?? ""));
  return (<main><h1>Residents</h1>
    <div className="table-scroll"><table><thead><tr><th>Student</th><th>Room</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {rows.map((a: any) => { const rm = a.bed_spaces?.rooms; const p = a.hostel_applications?.profiles;
        return (<tr key={a.id}><td>{p?.full_name}<br /><small>{p?.matric_no}</small></td><td>{rm?.hostels?.name}, room {rm?.room_no}{rm?.block ? ` (block ${rm.block})` : ""}, bed {a.bed_spaces?.label}</td>
          <td>{a.checked_in_at ? <span className="badge">Checked in</span> : <span className="badge gold">Not yet checked in</span>}</td><td><Actions id={a.id} checkedIn={!!a.checked_in_at} /></td></tr>); })}
      {!rows.length && <tr><td colSpan={4}>No residents yet.</td></tr>}</tbody></table></div></main>);
}
