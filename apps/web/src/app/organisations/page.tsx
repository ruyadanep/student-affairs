import { supabaseServer } from "@/lib/supabase/server";
import JoinButton from "./JoinButton";
export const metadata = { title: "Student organisations" };
export default async function Organisations() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  const { data: orgs } = await db.from("organisations").select("id,name,category,description,organisation_members(count)").eq("status", "approved").order("name");
  const { data: mine } = user ? await db.from("organisation_members").select("organisation_id").eq("student_id", user.id) : { data: [] };
  const { data: pending } = user ? await db.from("organisations").select("id,name,status,review_note").eq("submitted_by", user.id).neq("status", "approved") : { data: [] };
  const joined = new Set((mine ?? []).map((m) => m.organisation_id));
  return (<main><h1>Student organisations</h1>
    <p>Clubs and societies registered with Student Affairs. <a href="/organisations/new">Register a new organisation</a></p>
    {!!pending?.length && (<div className="card"><h2>Your submissions</h2>{pending.map((p) => (<p key={p.id}><strong>{p.name}</strong> <span className="badge gold">{p.status === "submitted" ? "Waiting for review" : p.status}</span>{p.review_note && <><br /><span className="err">{p.review_note}</span></>}</p>))}</div>)}
    {!orgs?.length && <p>No organisations are registered yet.</p>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(16rem,1fr))", gap: "1rem" }}>
      {(orgs ?? []).map((o: any) => (<div className="card" key={o.id} style={{ margin: 0 }}>
        {o.category && <span className="badge gold">{o.category}</span>}<h2 style={{ margin: ".4rem 0" }}>{o.name}</h2><p>{o.description}</p>
        {user ? (<><small>{o.organisation_members?.[0]?.count ?? 0} members</small><div style={{ marginTop: ".6rem" }}><JoinButton id={o.id} joined={joined.has(o.id)} /></div></>) : <small><a href="/login">Sign in</a> to join</small>}</div>))}
    </div></main>);
}
