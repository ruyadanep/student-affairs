import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";

export const metadata = { title: "More staff tools" };
const groups: [string, [string, string, string[]][]][] = [
  ["Hostels", [["/staff/payments", "Payment reconciliation (CSV)", ["hostel_officer"]], ["/staff/allocation", "Auto-allocate, swaps, priority", ["hostel_officer"]], ["/staff/hostel-desk", "Visitors, lost and found, inventory", ["hostel_officer"]]]],
  ["Clearance", [["/staff/clearance-bulk", "Bulk approval", ["clearance_officer"]], ["/staff/workload", "Workload and overdue", ["dean_office", "hostel_officer"]]]],
  ["Communication", [["/staff/announce", "Email, SMS, scheduling, templates", ["dean_office", "hostel_officer"]], ["/staff/outbox", "Delivery queue", ["dean_office", "hostel_officer"]]]],
  ["Student life", [["/staff/events", "Event requests and check-in", ["dean_office", "org_officer"]], ["/staff/elections", "Students' Union elections", ["dean_office"]]]],
  ["Discipline and privacy", [["/staff/cases", "Discipline cases and holds", ["dean_office", "hostel_officer", "welfare_officer", "clearance_officer", "org_officer"]], ["/staff/privacy", "Data protection requests", ["dean_office"]]]],
  ["Administration", [["/staff/security", "Security, settings, logins", ["super_admin"]]]],
];

export default async function Page() {
  const { roles } = await requireRole(["dean_office", "hostel_officer", "clearance_officer", "org_officer", "welfare_officer"], "/staff/more");
  const ok = (need: string[]) => roles.includes("super_admin") || need.some((r) => roles.includes(r));
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link href="/staff" className="text-sm text-[#0b5c36] underline">← Staff tools</Link>
      <h1 className="text-2xl font-bold">More staff tools</h1>
      {groups.map(([g, items]) => { const shown = items.filter(([, , need]) => ok(need)); return shown.length === 0 ? null : (
        <section key={g}><h2 className="mb-2 font-semibold">{g}</h2><ul className="grid gap-2 sm:grid-cols-2">{shown.map(([href, label]) => <li key={href}><Link href={href} className="block rounded border p-3 text-sm hover:bg-green-50">{label}</Link></li>)}</ul></section>); })}
    </main>
  );
}
