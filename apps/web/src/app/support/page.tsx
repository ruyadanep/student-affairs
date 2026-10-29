import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { RequestForm, MessageForm } from "./Forms";
const kinds: Record<string, string> = { counselling: "Counselling", special_needs: "Special-needs support", complaint: "Complaint", hardship: "Hardship support" };
const status: Record<string, string> = { submitted: "Received", in_review: "Being reviewed", scheduled: "Appointment set", resolved: "Resolved", closed: "Closed" };
export const metadata = { title: "Welfare and support" };
export default async function Support() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: reqs } = await db.from("support_requests").select("id,kind,subject,status,scheduled_at,resolution_note,created_at,support_messages(id,body,author_id,created_at)").eq("student_id", user.id).order("created_at", { ascending: false });
  return (<main style={{ maxWidth: "48rem" }}><h1>Welfare and support</h1>
    <div className="card" style={{ borderColor: "var(--accent)" }}><strong>In an emergency</strong><p style={{ margin: ".3rem 0 0" }}>If you or someone else is in immediate danger, call emergency services or go to the nearest medical centre. This page is not monitored around the clock.</p></div>
    <p>Your requests are private. Only the staff who handle them can read what you write.</p>
    <div className="card"><h2 style={{ marginTop: 0 }}>Ask for support</h2><RequestForm /></div>
    <h2>Your requests</h2>{!reqs?.length && <p>You haven't made a request yet.</p>}
    {(reqs ?? []).map((r: any) => (<div className="card" key={r.id}>
      <strong>{r.subject}</strong> <span className="badge gold">{status[r.status]}</span><div><small>{kinds[r.kind]} · {new Date(r.created_at).toDateString()}</small></div>
      {r.scheduled_at && <p><strong>Appointment:</strong> {new Date(r.scheduled_at).toLocaleString("en-GB", { timeZone: "Africa/Lagos", dateStyle: "full", timeStyle: "short" })}</p>}
      {r.resolution_note && <p>{r.resolution_note}</p>}
      {(r.support_messages ?? []).sort((a: any, b: any) => a.created_at.localeCompare(b.created_at)).map((m: any) => <p key={m.id} style={{ margin: ".2rem 0" }}><small><strong>{m.author_id === user.id ? "You" : "Support team"}:</strong> {m.body}</small></p>)}
      {r.status !== "closed" && <MessageForm requestId={r.id} />}</div>))}
  </main>);
}
