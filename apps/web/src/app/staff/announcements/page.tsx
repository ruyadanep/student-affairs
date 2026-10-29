import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Compose from "./Compose";
export const metadata = { title: "Announcements" };
export default async function Announcements() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["dean_office", "hostel_officer", "super_admin"]);
  if (!roles?.length) return <main><h1>Announcements</h1><p>This page is for the Dean's office and hostel office.</p></main>;
  const { data: hostels } = await db.from("hostels").select("id,name").order("name");
  const { data: fac } = await db.from("profiles").select("faculty").not("faculty", "is", null).limit(5000);
  const faculties = [...new Set((fac ?? []).map((f) => f.faculty as string))].sort();
  const { data: past } = await db.from("announcements").select("id,title,published_at,audience").order("published_at", { ascending: false }).limit(15);
  const who = (a: any) => { const p = [a?.hostel_ids?.length && "selected hostels", a?.levels?.length && `levels ${a.levels.join(", ")}`, a?.faculties?.length && a.faculties.join(", ")].filter(Boolean); return p.length ? p.join(" · ") : "All students"; };
  return (<main><h1>Announcements</h1>
    <Compose hostels={(hostels ?? []).map((h) => [h.id, h.name])} faculties={faculties} />
    <h2>Recently sent</h2>
    <div className="table-scroll"><table><thead><tr><th>Title</th><th>Audience</th><th>Sent</th></tr></thead><tbody>
      {(past ?? []).map((a) => <tr key={a.id}><td>{a.title}</td><td>{who(a.audience)}</td><td>{new Date(a.published_at).toLocaleString()}</td></tr>)}
      {!past?.length && <tr><td colSpan={3}>Nothing sent yet.</td></tr>}</tbody></table></div></main>);
}
