import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { logRead } from "@/lib/logRead";
import { MessageForm } from "@/app/support/Forms";
import Actions from "./Actions";
const kinds: Record<string, string> = { counselling: "Counselling", special_needs: "Special-needs support", complaint: "Complaint", hardship: "Hardship support" };
export const metadata = { title: "Support requests" };
export default async function StaffSupport() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["welfare_officer", "dean_office", "super_admin"]);
  if (!roles?.length) return <main><h1>Support requests</h1><p>This page is for welfare staff and the Dean's office.</p></main>;
  const { data: reqs } = await db.from("support_requests").select("id,kind,subject,details,preferred_times,status,scheduled_at,student_id,created_at,profiles!support_requests_student_id_fkey(full_name,matric_no),support_messages(id,body,author_id,created_at)").in("status", ["submitted", "in_review", "scheduled", "resolved"]).order("created_at");
  await logRead(db, "support_requests", `queue:${(reqs ?? []).length}`);
  return (<main><h1>Support requests</h1>
    <p><small>Confidential. You only see the request types your role is allowed to handle. Notifications to students never include what they wrote.</small></p>
    {!reqs?.length && <p>No open requests.</p>}
    {(reqs ?? []).map((r: any) => (<div className="card" key={r.id}>
      <strong>{r.subject}</strong> <span className="badge gold">{r.status.replace("_", " ")}</span>
      <div><small>{kinds[r.kind]} · {r.profiles?.full_name} ({r.profiles?.matric_no}) · {new Date(r.created_at).toLocaleString()}</small></div>
      <p style={{ whiteSpace: "pre-line" }}>{r.details}</p>{r.preferred_times && <p><small>Preferred times: {r.preferred_times}</small></p>}
      {r.scheduled_at && <p><small>Appointment: {new Date(r.scheduled_at).toLocaleString("en-GB", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" })}</small></p>}
      {(r.support_messages ?? []).sort((a: any, b: any) => a.created_at.localeCompare(b.created_at)).map((m: any) => <p key={m.id} style={{ margin: ".2rem 0" }}><small><strong>{m.author_id === r.student_id ? "Student" : "Staff"}:</strong> {m.body}</small></p>)}
      <MessageForm requestId={r.id} /><div style={{ marginTop: ".6rem" }}><Actions id={r.id} status={r.status} /></div></div>))}
  </main>);
}
