import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Actions from "./Actions";
export const metadata = { title: "Room changes" };
export default async function RoomChanges() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["hostel_officer", "super_admin"]);
  if (!roles?.length) return <main><h1>Room changes</h1><p>This page is for hostel office staff.</p></main>;
  const { data: reqs } = await db.from("room_change_requests").select("id,reason,created_at,allocations(bed_spaces(label,rooms(block,room_no,hostels(name))),hostel_applications(profiles(full_name,matric_no)))").eq("status", "submitted").order("created_at");
  return (<main><h1>Room change requests</h1>
    <p><small>Approving releases the student's current bed and returns them to the allocation queue on the Hostel applications page.</small></p>
    <div className="table-scroll"><table><thead><tr><th>Student</th><th>Current room</th><th>Reason</th><th>Action</th></tr></thead><tbody>
      {(reqs ?? []).map((r: any) => { const a = r.allocations; const rm = a?.bed_spaces?.rooms; const p = a?.hostel_applications?.profiles;
        return (<tr key={r.id}><td>{p?.full_name}<br /><small>{p?.matric_no}</small></td><td>{rm?.hostels?.name}, room {rm?.room_no}{rm?.block ? ` (block ${rm.block})` : ""}, bed {a?.bed_spaces?.label}</td><td>{r.reason}</td><td><Actions id={r.id} /></td></tr>); })}
      {!reqs?.length && <tr><td colSpan={4}>No requests waiting.</td></tr>}</tbody></table></div></main>);
}
