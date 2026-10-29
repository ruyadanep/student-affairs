import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { RoleChip, ActiveToggle, AddRole } from "./UserActions";
export const metadata = { title: "Users and roles" };
export default async function Users() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/staff/users");
  const { data: mine } = await db.from("user_roles").select("role").eq("user_id", user.id);
  const roles = (mine ?? []).map((r) => r.role as string);
  if (!roles.some((r) => r === "dean_office" || r === "super_admin")) return <main><h1>Users and roles</h1><p>This page is for the Dean's office.</p></main>;
  const canEdit = roles.includes("super_admin");
  const { data: rows } = await db.from("user_roles").select("user_id,role,profiles(full_name,email)").neq("role", "student");
  const { data: units } = await db.from("clearance_units").select("id,name,sequence").order("sequence");
  const { data: links } = await db.from("unit_officers").select("user_id,clearance_units(name)");
  const banned = new Map<string, boolean>();
  if (canEdit) { try { const { data } = await supabaseAdmin().auth.admin.listUsers({ perPage: 1000 }); data?.users.forEach((u: any) => banned.set(u.id, !!u.banned_until && new Date(u.banned_until) > new Date())); } catch {} }
  const byUser = new Map<string, { name: string; email: string; roles: string[] }>();
  (rows ?? []).forEach((r: any) => { const e = byUser.get(r.user_id) ?? { name: r.profiles?.full_name, email: r.profiles?.email, roles: [] as string[] }; e.roles.push(r.role); byUser.set(r.user_id, e); });
  return (<main><h1>Users and roles</h1>
    {!canEdit && <p><small>You can see who has staff access. Only a super admin can change it.</small></p>}
    {canEdit && <AddRole units={(units ?? []).map((u) => [u.id, u.name])} />}
    <div className="table-scroll"><table><thead><tr><th>Person</th><th>Roles</th><th>Clearance units</th>{canEdit && <th>Account</th>}</tr></thead><tbody>
      {[...byUser.entries()].map(([id, u]) => (<tr key={id}><td>{u.name}<br /><small>{u.email}</small></td>
        <td>{u.roles.map((r) => <RoleChip key={r} userId={id} role={r} canEdit={canEdit} />)}</td>
        <td>{(links ?? []).filter((l: any) => l.user_id === id).map((l: any) => l.clearance_units?.name).join(", ") || "-"}</td>
        {canEdit && <td>{banned.get(id) && <span className="badge red" style={{ marginRight: ".4rem" }}>Deactivated</span>}{id !== user.id && <ActiveToggle userId={id} active={!banned.get(id)} />}</td>}</tr>))}
      {!byUser.size && <tr><td colSpan={4}>No staff yet.</td></tr>}</tbody></table></div></main>);
}
