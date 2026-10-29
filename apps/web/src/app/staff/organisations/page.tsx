import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Actions from "./Actions";
export const metadata = { title: "Organisation requests" };
export default async function StaffOrgs() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["org_officer", "dean_office", "super_admin"]);
  if (!roles?.length) return <main><h1>Organisation requests</h1><p>This page is for organisation officers and the Dean's office.</p></main>;
  const { data: orgs } = await db.from("organisations").select("id,name,category,description,created_at,profiles!organisations_submitted_by_fkey(full_name,matric_no)").eq("status", "submitted").order("created_at");
  return (<main><h1>Organisation requests</h1>
    <div className="table-scroll"><table><thead><tr><th>Organisation</th><th>Submitted by</th><th>Action</th></tr></thead><tbody>
      {(orgs ?? []).map((o: any) => (<tr key={o.id}><td><strong>{o.name}</strong> {o.category && <span className="badge gold">{o.category}</span>}<br /><small>{o.description}</small></td><td>{o.profiles?.full_name}<br /><small>{o.profiles?.matric_no}</small></td><td><Actions id={o.id} /></td></tr>))}
      {!orgs?.length && <tr><td colSpan={3}>No requests waiting.</td></tr>}</tbody></table></div></main>);
}
