import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Handled from "./Handled";
export const metadata = { title: "Contact messages" };
export default async function Messages() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["dean_office", "super_admin"]);
  if (!roles?.length) return <main><h1>Messages</h1><p>This page is for the Dean's office.</p></main>;
  const { data: msgs } = await db.from("contact_messages").select("id,name,email,topic,message,created_at").eq("handled", false).order("created_at");
  return (<main><h1>Contact messages</h1>{!msgs?.length && <p>No new messages.</p>}
    {(msgs ?? []).map((m) => (<div className="card" key={m.id}><strong>{m.name}</strong> <small>({m.email}){m.topic ? ` · ${m.topic}` : ""} · {new Date(m.created_at).toLocaleString()}</small>
      <p style={{ whiteSpace: "pre-line" }}>{m.message}</p><Handled id={m.id} /></div>))}</main>);
}
