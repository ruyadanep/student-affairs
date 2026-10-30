"use client";
import { usePathname } from "next/navigation";
import { units } from "@/lib/units";

// One banner with a breadcrumb for every inner page. Rendered once in the root layout, so no page needs its own.
const labels: Record<string, [string, string?]> = {
  about: ["About us", "Who we are and what the Division of Student Affairs does"], team: ["Our team", "The people behind Student Affairs"],
  units: ["Our units", "The six units of the Student Affairs directorate"], hostels: ["Hostel accommodation", "Apply, check payment and see your room"],
  clearance: ["Clearance", "Track every unit that clears you"], letters: ["Letters and attestations", "Request letters verified by QR code"],
  maintenance: ["Hostel maintenance", "Report and follow room faults"], support: ["Welfare and support", "Counselling, accessibility and complaints"],
  organisations: ["Student organisations", "Register or join clubs and societies"], events: ["Events", "Campus events and RSVP"],
  elections: ["Students' Union elections", "Vote and see results"], "lost-found": ["Lost and found", "Items waiting to be claimed"],
  news: ["News and notices", "Latest from Student Affairs"], faq: ["Frequently asked questions", "Quick answers"], contact: ["Contact us", "Send the office a message"],
  privacy: ["Privacy notice", "How we handle your data"], verify: ["Verify a document", "Check that a letter or certificate is real"],
  login: ["Sign in", "Students and staff use the same sign-in"], register: ["Create your account", "Use your matric number"],
  "forgot-password": ["Forgot password"], "reset-password": ["Reset password"], notifications: ["Notifications", "Notices sent to you"],
  account: ["My account", "Alerts, sign-ins and your data"], "my-case": ["My case"], mfa: ["Two-step sign-in"], new: ["Register"],
  staff: ["Staff tools", "Work for your role"], allocation: ["Allocation tools"], announce: ["Announcements"], announcements: ["Announcements"],
  audit: ["Audit log"], cases: ["Discipline cases"], "clearance-bulk": ["Bulk clearance approval"], "hostel-desk": ["Hostel desk"],
  lookup: ["Student lookup"], messages: ["Contact messages"], more: ["More staff tools"], outbox: ["Delivery queue"], payments: ["Payment reconciliation"],
  priority: ["Priority category"], quality: ["Data quality"], reports: ["Reports"], residents: ["Residents"], rollover: ["Session rollover"],
  "room-changes": ["Room change requests"], security: ["Security"], settings: ["Settings"], setup: ["Setup"], students: ["Student list"], users: ["Users and roles"], workload: ["Workload and overdue"],
  setupmfa: ["Set up two-step sign-in"], verifymfa: ["Verify"],
};
// Pages that live under another section in the navigation
const parent: Record<string, string> = { team: "about" };
const dynamicLabel = (prev: string, seg: string): string => {
  if (prev === "units") return units.find((u) => u.slug === seg)?.name ?? "Unit";
  if (prev === "team") return "Profile"; if (prev === "news") return "Article"; if (prev === "elections") return "Election";
  if (prev === "verify") return "Result"; if (prev === "cases") return "Case";
  return seg.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
};

export default function PageBanner() {
  const path = usePathname() ?? "/";
  const segs = path.split("/").filter(Boolean);
  if (!segs.length || segs[0] === "api" || segs[0] === "auth") return null;
  const first = segs[0];
  const crumbs: { label: string; href?: string }[] = [{ label: "Home", href: "/" }];
  if (parent[first]) crumbs.push({ label: labels[parent[first]][0], href: `/${parent[first]}` });
  segs.forEach((seg, i) => {
    const known = labels[seg];
    const label = known && !(i > 0 && ["units", "team", "news", "elections", "verify", "cases"].includes(segs[i - 1])) ? known[0] : dynamicLabel(segs[i - 1] ?? "", seg);
    crumbs.push({ label, href: i < segs.length - 1 ? "/" + segs.slice(0, i + 1).join("/") : undefined });
  });
  const title = crumbs[crumbs.length - 1].label;
  const sub = segs.length === 1 ? labels[first]?.[1] : undefined;
  return (
    <div className="banner"><div className="wrap">
      <nav aria-label="Breadcrumb"><ol className="crumbs">
        {crumbs.map((c, i) => (<li key={i} {...(c.href ? {} : { "aria-current": "page" as const })}>{c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}</li>))}
      </ol></nav>
      <div className="banner-title" aria-hidden="true">{title}</div>
      {sub && <p className="banner-sub" aria-hidden="true">{sub}</p>}
    </div></div>
  );
}
