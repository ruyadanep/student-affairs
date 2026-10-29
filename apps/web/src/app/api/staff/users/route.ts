import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
const ROLES = ["hostel_officer", "clearance_officer", "org_officer", "welfare_officer", "dean_office", "super_admin"];
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return fail("Sign in first.", 401);
  const { data: mine } = await db.from("user_roles").select("role").eq("user_id", user.id);
  if (!(mine ?? []).some((r) => r.role === "super_admin")) return fail("Only a super admin can manage roles.", 403);
  const b = await req.json(); const log = (action: string, meta: object) => db.rpc("log_event", { p_action: action, p_entity: "user_roles", p_meta: meta });
  if (b.action === "add_role") {
    if (!ROLES.includes(b.role)) return fail("Choose a role.");
    const { data: p } = await db.from("profiles").select("id,email").ilike("email", String(b.email ?? "").trim()).maybeSingle();
    if (!p) return fail("No account has that email. They must sign up or be created first.");
    const { error } = await db.from("user_roles").upsert({ user_id: p.id, role: b.role }, { onConflict: "user_id,role", ignoreDuplicates: true });
    if (error) return fail("The role couldn't be saved.", 500);
    if (b.role === "clearance_officer" && b.unit_id) await db.from("unit_officers").upsert({ user_id: p.id, unit_id: b.unit_id }, { onConflict: "user_id,unit_id", ignoreDuplicates: true });
    await log("role_added", { email: p.email, role: b.role }); return NextResponse.json({ ok: true });
  }
  if (b.action === "remove_role") {
    if (b.role === "super_admin") {
      if (b.user_id === user.id) return fail("Ask another super admin to remove your own super admin role.");
      const { count } = await db.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "super_admin");
      if ((count ?? 0) <= 1) return fail("You can't remove the last super admin.");
    }
    const { error } = await db.from("user_roles").delete().eq("user_id", b.user_id).eq("role", b.role);
    if (error) return fail("The role couldn't be removed.", 500);
    if (b.role === "clearance_officer") await db.from("unit_officers").delete().eq("user_id", b.user_id);
    await log("role_removed", { user_id: b.user_id, role: b.role }); return NextResponse.json({ ok: true });
  }
  if (b.action === "set_active") {
    if (b.user_id === user.id) return fail("You can't deactivate your own account.");
    const { error } = await supabaseAdmin().auth.admin.updateUserById(b.user_id, { ban_duration: b.active ? "none" : "876000h" });
    if (error) return fail("The account couldn't be updated.", 500);
    await log(b.active ? "account_reactivated" : "account_deactivated", { user_id: b.user_id }); return NextResponse.json({ ok: true });
  }
  return fail("Unknown action.");
}
