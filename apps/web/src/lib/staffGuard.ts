import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

/** Server-side page guard. super_admin always passes. Database RLS/RPC checks remain the real enforcement. */
export async function requireRole(roles: string[], next = "/staff") {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  const { data } = await db.from("user_roles").select("role").eq("user_id", user.id);
  const mine = (data ?? []).map((r: { role: string }) => r.role);
  if (!mine.includes("super_admin") && !roles.some((r) => mine.includes(r))) redirect("/staff");
  return { db, user, roles: mine };
}
