import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Form from "./Form";
export const metadata = { title: "New session" };
export default async function Rollover() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/staff/rollover");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["dean_office", "super_admin"]);
  if (!roles?.length) return <main><h1>New session</h1><p>This page is for the Dean's office.</p></main>;
  const { data: cur } = await db.from("hostel_sessions").select("academic_session").eq("is_current", true).maybeSingle();
  const { count: rooms } = await db.from("allocations").select("*", { count: "exact", head: true }).eq("status", "active");
  const { count: fresh } = await db.from("profiles").select("*", { count: "exact", head: true }).eq("is_fresh", true);
  return (<main style={{ maxWidth: "40rem" }}><h1>Start a new session</h1>
    <p>Current session: <strong>{cur?.academic_session ?? "none"}</strong>. Starting a new one closes it and opens applications for the next.</p>
    <div className="card"><strong>What will change</strong><ul style={{ margin: ".4rem 0 0", paddingLeft: "1.1rem" }}><li>{rooms ?? 0} students currently hold a room.</li><li>{fresh ?? 0} students are flagged as fresh.</li><li>Clearance and letters are kept. Clearance is tracked per session, so students start fresh.</li><li>Final-year flags are not changed. Re-import the student list with the new flags.</li></ul></div>
    <p className="err"><strong>This can't be undone from the site.</strong> Export your reports first.</p><Form /></main>);
}
