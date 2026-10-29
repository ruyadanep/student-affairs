import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
type Tool = { t: string; h: string; d: string; n?: number | null };
export const metadata = { title: "Staff tools" };
export default async function Staff() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/staff");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id);
  const mine = (roles ?? []).map((r) => r.role as string);
  if (!mine.some((r) => r !== "student")) return <main><h1>Staff tools</h1><p>Signed in as {user.email}. This account has no staff role. Ask the Dean's office to assign one.</p></main>;
  const waiting = async (table: string, f: (q: any) => any): Promise<number | null> => { try { const { count, error } = await f(db.from(table).select("*", { count: "exact", head: true })); return error ? null : count ?? 0; } catch { return null; } };
  const [apps, changes, steps, tickets, support, letters, orgs, msgs] = await Promise.all([
    waiting("hostel_applications", (q) => q.in("status", ["submitted", "eligible"])), waiting("room_change_requests", (q) => q.eq("status", "submitted")),
    waiting("clearance_steps", (q) => q.eq("status", "pending")), waiting("maintenance_tickets", (q) => q.in("status", ["open", "assigned", "in_progress"])),
    waiting("support_requests", (q) => q.in("status", ["submitted", "in_review"])), waiting("document_requests", (q) => q.eq("status", "submitted")),
    waiting("organisations", (q) => q.eq("status", "submitted")), waiting("contact_messages", (q) => q.eq("handled", false))]);
  const groups: [string, Tool[]][] = [
    ["Accommodation", [{ t: "Hostel applications", h: "/staff/hostels", d: "Confirm payments and allocate beds.", n: apps }, { t: "Residents", h: "/staff/residents", d: "Check students in and out of their rooms." }, { t: "Room change requests", h: "/staff/room-changes", d: "Approve or reject requests to move rooms.", n: changes }, { t: "Maintenance tickets", h: "/staff/maintenance", d: "Take, update, and close hostel faults.", n: tickets }]],
    ["Student services", [{ t: "Clearance queue", h: "/staff/clearance", d: "Approve or return students for your unit.", n: steps }, { t: "Support requests", h: "/staff/support", d: "Counselling, special-needs, complaints, and hardship.", n: support }, { t: "Letter requests", h: "/staff/letters", d: "Approve and issue letters.", n: letters }, { t: "Organisation requests", h: "/staff/organisations", d: "Approve or reject new clubs and societies.", n: orgs }]],
    ["Communication", [{ t: "Announcements", h: "/staff/announce", d: "Send notices by app, email or SMS, schedule them, use templates." }, { t: "Contact messages", h: "/staff/messages", d: "Read and mark messages from the contact form.", n: msgs }]],
    ["Operations", [{ t: "Payment reconciliation", h: "/staff/payments", d: "Verify many hostel payments at once from the Bursary's CSV." }, { t: "Allocation tools", h: "/staff/allocation", d: "Auto-allocate beds, swap two students, set priority." }, { t: "Bulk clearance approval", h: "/staff/clearance-bulk", d: "Approve every student who is ready at your unit." }, { t: "Workload and overdue", h: "/staff/workload", d: "See what is waiting and what is overdue." }, { t: "Hostel desk", h: "/staff/hostel-desk", d: "Visitors, lost and found, inventory." }]],
    ["Student life", [{ t: "Event requests", h: "/staff/events", d: "Approve events and check people in." }, { t: "Elections", h: "/staff/elections", d: "Run Students' Union elections." }, { t: "Discipline cases", h: "/staff/cases", d: "Confidential cases, hearings and clearance holds." }]],
    ["Reports and security", [{ t: "Reports", h: "/staff/reports", d: "Occupancy, clearance and service figures." }, { t: "Audit log", h: "/staff/audit", d: "Who did what, and when." }, { t: "Data quality", h: "/staff/quality", d: "Find records that need fixing." }, { t: "Student lookup", h: "/staff/lookup", d: "One page with a student's whole record." }, { t: "Delivery queue", h: "/staff/outbox", d: "Email and SMS sending status." }, { t: "Data protection requests", h: "/staff/privacy", d: "Correction and deletion requests." }, { t: "Security", h: "/staff/security", d: "Settings, sign-in history, super-admin approvals." }]],
    ["Administration", [{ t: "Users and roles", h: "/staff/users", d: "Give and remove staff roles." }, { t: "Session rollover", h: "/staff/rollover", d: "Start a new academic session." },{ t: "Team profiles", h: "/staff/team", d: "Edit your bio and photo, or manage the public team page." }, { t: "Student list", h: "/staff/students", d: "Import enrolled students so they can create accounts." }, { t: "Setup", h: "/staff/setup", d: "Sessions, hostels, rooms, clearance units, and staff roles." }]],
  ];
  return (<main><h1>Staff tools</h1><p><small>Signed in as {user.email} · roles: {mine.join(", ")}</small></p>
    {groups.map(([g, tools]) => (<section key={g}><h2 className="group-title">{g}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(16rem,1fr))", gap: "1rem" }}>
        {tools.map((x) => (<a key={x.h} href={x.h} className="card" style={{ margin: 0, textDecoration: "none", color: "var(--ink)" }}>
          <strong style={{ color: "var(--brand)" }}>{x.t}</strong>{!!x.n && <span className="badge gold count">{x.n} waiting</span>}
          <p style={{ margin: ".3rem 0 0", color: "var(--muted)" }}>{x.d}</p></a>))}</div></section>))}
  </main>);
}
