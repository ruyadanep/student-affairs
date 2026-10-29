import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import RpcForm from "@/components/RpcForm";

export const metadata = { title: "Security" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { db, user } = await requireRole(["super_admin"], "/staff/security");
  const [{ data: logins }, { data: reqs }, { data: settings }] = await Promise.all([
    db.from("login_events").select("id,email,ip,user_agent,created_at").order("created_at", { ascending: false }).limit(50),
    db.from("admin_grant_requests").select("id,status,requested_by,created_at,profiles:target_user(full_name,email)").order("created_at", { ascending: false }).limit(20),
    db.from("app_settings").select("key,value"),
  ]);
  const val = (k: string) => (settings ?? []).find((s: { key: string }) => s.key === k)?.value ?? "";
  type G = { id: string; status: string; requested_by: string; profiles: { full_name: string; email: string | null } | { full_name: string; email: string | null }[] | null };
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 text-sm">
      <Link href="/staff">← Staff tools</Link>
      <h1 className="text-2xl font-bold">Security</h1>

      <section className="rounded border p-4"><h2 className="mb-2 font-semibold">Settings</h2>
        <ul className="mb-3 space-y-1"><li>Require two-step sign-in for staff: <b>{val("require_staff_mfa")}</b></li><li>Email key alerts to students: <b>{val("email_key_alerts")}</b></li><li>Overdue after (days): <b>{val("overdue_days")}</b></li></ul>
        <RpcForm fn="set_setting" button="Save setting" fields={[
          { name: "p_key", label: "Setting", type: "select", options: [["require_staff_mfa", "Require staff two-step sign-in (true/false)"], ["email_key_alerts", "Email key alerts (true/false)"], ["overdue_days", "Overdue after days (number)"]] },
          { name: "p_value", label: "Value", required: true }]} />
        <p className="mt-2 text-xs text-gray-600">Turn two-step sign-in on only after every staff member has enrolled an authenticator app.</p></section>

      <section className="rounded border p-4"><h2 className="mb-2 font-semibold">Grant super admin (two-person rule)</h2>
        <p className="mb-3">With two or more super admins, a grant needs a second super admin to approve it.</p>
        <RpcForm fn="request_super_admin" button="Request" fields={[{ name: "p_email", label: "Account email", required: true }]} />
        <ul className="mt-3 divide-y">{((reqs ?? []) as unknown as G[]).map((g) => { const p = Array.isArray(g.profiles) ? g.profiles[0] : g.profiles; return (
          <li key={g.id} className="flex items-center justify-between gap-3 py-2"><span>{p?.full_name} ({p?.email}) · {g.status}</span>
            {g.status === "pending" && (g.requested_by === user.id ? <span className="text-xs text-gray-600">waiting for another super admin</span> :
              <span className="flex gap-2"><RpcForm fn="approve_super_admin" hidden={{ p_id: g.id }} fields={[]} button="Approve" confirmText="Make this person a super admin?" /><RpcForm fn="reject_super_admin" hidden={{ p_id: g.id }} fields={[]} button="Reject" /></span>)}</li>); })}</ul></section>

      <section><h2 className="mb-2 font-semibold">Recent sign-ins</h2>
        <ul className="divide-y rounded border">{(logins ?? []).map((l: { id: number; email: string | null; ip: string | null; created_at: string }) => <li key={l.id} className="p-2">{new Date(l.created_at).toLocaleString("en-NG")} · {l.email} · {l.ip ?? "?"}</li>)}</ul></section>
    </main>
  );
}
