import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { photoUrl } from "@/lib/staffPhoto";
import TeamEditor, { type M } from "./TeamEditor";
export default async function StaffTeam() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/staff/team");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id);
  if (!(roles ?? []).some((r) => r.role !== "student")) return <main><h1>Team profiles</h1><p>This page is for staff.</p></main>;
  const admin = (roles ?? []).some((r) => r.role === "dean_office" || r.role === "super_admin");
  let q = db.from("staff_members").select("*,profiles(email)").order("sort_order").order("full_name");
  if (!admin) q = q.eq("user_id", user.id);
  const { data } = await q;
  const members: M[] = (data ?? []).map((m: any) => ({ ...m, photo_url: photoUrl(m.photo_path, m.updated_at), account_email: m.profiles?.email ?? null }));
  return (<main><h1>Team profiles</h1>
    <p>{admin ? "Add and edit the people shown on the public " : "Edit your bio and photo for the public "}<a href="/team">Our team</a> page.{!admin && " Other details are managed by the Dean's office."}</p>
    {admin && <TeamEditor isNew admin m={{ full_name: "", title: null, unit: null, bio: null, email: null, phone: null, sort_order: 100, published: true, photo_url: null, account_email: null }} />}
    {!admin && !members.length && <p>You don't have a team profile yet. Ask the Dean's office to create one linked to your account.</p>}
    {members.map((m) => <TeamEditor key={m.id} m={m} admin={admin} />)}</main>);
}
