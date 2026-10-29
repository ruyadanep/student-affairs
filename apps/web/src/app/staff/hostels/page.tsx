import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Actions from "./Actions";
export const metadata = { title: "Hostel applications" };
export default async function StaffHostels() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["hostel_officer", "super_admin"]);
  if (!roles?.length) return <main><h1>Hostel office</h1><p>This page is for hostel office staff.</p></main>;
  const { data: apps } = await db.from("hostel_applications").select("id,status,payment_id,created_at,profiles(full_name,matric_no,gender),payment_records(reference,status)").in("status", ["submitted", "eligible", "waitlisted"]).order("created_at");
  return (<main><h1>Hostel applications</h1>
    <div className="table-scroll"><table><thead><tr><th>Student</th><th>Payment reference</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {(apps ?? []).map((a: any) => (<tr key={a.id}><td>{a.profiles?.full_name}<br /><small>{a.profiles?.matric_no} · {a.profiles?.gender}</small></td>
        <td>{a.payment_records?.reference}<br /><small>{a.payment_records?.status}</small></td><td><span className="badge gold">{a.status}</span></td>
        <td><Actions appId={a.id} payId={a.payment_id} status={a.status} payStatus={a.payment_records?.status ?? null} /></td></tr>))}
      {!apps?.length && <tr><td colSpan={4}>No applications waiting.</td></tr>}
    </tbody></table></div></main>);
}
