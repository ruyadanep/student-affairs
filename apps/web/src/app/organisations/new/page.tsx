import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import RegisterForm from "./RegisterForm";
export const metadata = { title: "Register an organisation" };
export default async function NewOrg() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  return (<main style={{ maxWidth: "36rem" }}><h1>Register an organisation</h1><p>Student Affairs reviews each request. You'll be notified when it's decided.</p><RegisterForm /></main>);
}
