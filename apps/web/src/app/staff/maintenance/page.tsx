import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { CommentForm } from "@/app/maintenance/Forms";
import Actions from "./Actions";
export const metadata = { title: "Maintenance tickets" };
export default async function StaffMaintenance() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["hostel_officer", "super_admin"]);
  if (!roles?.length) return <main><h1>Maintenance</h1><p>This page is for hostel office staff.</p></main>;
  const { data: tickets } = await db.from("maintenance_tickets").select("id,category,description,status,created_at,reporter_id,hostels(name),rooms(block,room_no),profiles!maintenance_tickets_reporter_id_fkey(full_name,matric_no),ticket_comments(id,body,author_id,created_at)").neq("status", "closed").order("created_at");
  return (<main><h1>Maintenance tickets</h1>
    {!tickets?.length && <p>No open tickets.</p>}
    {(tickets ?? []).map((t: any) => (<div className="card" key={t.id}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div><strong>{t.category}</strong> <span className="badge gold">{t.status.replace("_", " ")}</span>
          <div><small>{t.profiles?.full_name} ({t.profiles?.matric_no}) · {t.hostels?.name ?? "No room on record"}{t.rooms ? `, room ${t.rooms.room_no}` : ""}</small></div></div>
        <Actions id={t.id} status={t.status} /></div>
      <p>{t.description}</p>
      {(t.ticket_comments ?? []).sort((a: any, b: any) => a.created_at.localeCompare(b.created_at)).map((c: any) => <p key={c.id} style={{ margin: ".2rem 0" }}><small><strong>{c.author_id === t.reporter_id ? "Student" : "Staff"}:</strong> {c.body}</small></p>)}
      <CommentForm ticketId={t.id} /></div>))}
  </main>);
}
