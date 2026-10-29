import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Actions from "./Actions";
export const metadata = { title: "Letter requests" };
export default async function StaffLetters() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["dean_office", "welfare_officer", "super_admin"]);
  if (!roles?.length) return <main><h1>Letter requests</h1><p>This page is for the Dean's office and welfare staff.</p></main>;
  const { data: reqs } = await db.from("document_requests").select("id,doc_type,purpose,addressee,created_at,profiles(full_name,matric_no)").eq("status", "submitted").order("created_at");
  return (<main><h1>Letter requests</h1>
    <div className="table-scroll"><table><thead><tr><th>Student</th><th>Type</th><th>Purpose</th><th>Action</th></tr></thead><tbody>
      {(reqs ?? []).map((r: any) => (<tr key={r.id}><td>{r.profiles?.full_name}<br /><small>{r.profiles?.matric_no}</small></td><td>{r.doc_type.replace("_", " ")}</td><td>{r.purpose}{r.addressee && <><br /><small>To: {r.addressee}</small></>}</td><td><Actions id={r.id} /></td></tr>))}
      {!reqs?.length && <tr><td colSpan={4}>No requests waiting.</td></tr>}
    </tbody></table></div></main>);
}
