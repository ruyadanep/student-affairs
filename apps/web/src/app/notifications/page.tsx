import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import MarkRead from "./MarkRead";
export const metadata = { title: "Notifications" };
export default async function Notifications() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: items } = await db.from("notifications").select("id,title,body,read_at,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
  const unread = (items ?? []).filter((n) => !n.read_at).length;
  return (<main><h1>Notifications</h1>
    {unread > 0 && <p><MarkRead /></p>}
    {!items?.length && <p>You have no notifications yet.</p>}
    {(items ?? []).map((n) => (<div className="card" key={n.id} style={n.read_at ? { opacity: 0.75 } : { borderColor: "var(--brand)" }}>
      <strong>{n.title}</strong> {!n.read_at && <span className="badge gold">New</span>}
      {n.body && <p style={{ margin: ".3rem 0" }}>{n.body}</p>}<small>{new Date(n.created_at).toLocaleString()}</small></div>))}
  </main>);
}
