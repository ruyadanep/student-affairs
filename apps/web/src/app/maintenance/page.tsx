import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { ReportForm, CommentForm } from "./Forms";
const label: Record<string, string> = { open: "Reported", assigned: "Assigned", in_progress: "Being fixed", resolved: "Fixed", closed: "Closed" };
export const metadata = { title: "Hostel maintenance" };
export default async function Maintenance() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: tickets } = await db.from("maintenance_tickets").select("id,category,description,status,created_at,hostels(name),rooms(block,room_no),ticket_comments(id,body,author_id,created_at)").eq("reporter_id", user.id).order("created_at", { ascending: false });
  return (<main><h1>Hostel maintenance</h1>
    <div className="card"><h2>Report a fault</h2><ReportForm /></div>
    <h2>Your reports</h2>{!tickets?.length && <p>You haven't reported anything.</p>}
    {(tickets ?? []).map((t: any) => (<div className="card" key={t.id}>
      <strong>{t.category}</strong> <span className={t.status === "resolved" || t.status === "closed" ? "badge" : "badge gold"}>{label[t.status]}</span>
      {t.hostels && <div><small>{t.hostels.name}{t.rooms ? `, room ${t.rooms.room_no}${t.rooms.block ? ` (block ${t.rooms.block})` : ""}` : ""}</small></div>}
      <p>{t.description}</p>
      {(t.ticket_comments ?? []).sort((a: any, b: any) => a.created_at.localeCompare(b.created_at)).map((c: any) => <p key={c.id} style={{ margin: ".2rem 0" }}><small><strong>{c.author_id === user.id ? "You" : "Hostel office"}:</strong> {c.body}</small></p>)}
      {t.status !== "closed" && <CommentForm ticketId={t.id} />}</div>))}
  </main>);
}
