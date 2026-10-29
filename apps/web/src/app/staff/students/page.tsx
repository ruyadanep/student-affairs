import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Import from "./Import";
export const metadata = { title: "Student list" };
export default async function Students() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["dean_office", "super_admin"]);
  if (!roles?.length) return <main><h1>Student list</h1><p>This page is for the Dean's office.</p></main>;
  const { count: total } = await db.from("enrolled_students").select("*", { count: "exact", head: true });
  const { count: claimed } = await db.from("enrolled_students").select("*", { count: "exact", head: true }).not("claimed_by", "is", null);
  return (<main><h1>Student list</h1>
    <p>{total ?? 0} students on the list, {claimed ?? 0} have created accounts.</p>
    <h2>Import students</h2>
    <p>Upload a CSV with a header row. Required columns: <code>matric_no</code>, <code>full_name</code>. Optional: <code>email</code>, <code>gender</code> (male or female), <code>faculty</code>, <code>department</code>, <code>level</code>, <code>is_fresh</code> and <code>is_final_year</code> (yes or no). Importing again updates existing students and never resets accounts.</p>
    <p><small>If a student's email is on the list, they must register with that exact email. This is the strongest check, so include emails whenever you can.</small></p>
    <Import /></main>);
}
