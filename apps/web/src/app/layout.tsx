import "./globals.css";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { supabaseServer } from "@/lib/supabase/server";
import SessionGuard from "@/components/SessionGuard";
import PageBanner from "@/components/PageBanner";
import { units } from "@/lib/units";
import { office } from "@/lib/site";
export const metadata = {
  title: { default: "Student Affairs | Plateau State University", template: "%s | Student Affairs" },
  icons: { icon: "/icon.png" }, description: "Hostels, clearance, student organisations, letters and welfare services for Plateau State University, Bokkos.",
};
export const viewport = { themeColor: "#063d24" };
const services: [string, string, string][] = [
  ["Hostel accommodation", "Apply, check payment, and see your room", "/hostels"], ["Clearance", "Track every unit that clears you", "/clearance"],
  ["Hostel maintenance", "Report and follow room faults", "/maintenance"], ["Letters and attestations", "Request letters with QR verification", "/letters"],
  ["Welfare and support", "Counselling, accessibility, complaints", "/support"], ["Student organisations", "Register or join clubs and societies", "/organisations"],
  ["Events", "Campus events and RSVP", "/events"], ["Students' Union elections", "Vote and see results", "/elections"], ["Lost and found", "Items waiting to be claimed", "/lost-found"],
];
async function session() {
  try {
    const db = await supabaseServer(); const { data: { user } } = await db.auth.getUser();
    if (!user) return { user: null, staff: false, unread: null as number | null };
    const [{ data: roles }, { count }] = await Promise.all([
      db.from("user_roles").select("role").eq("user_id", user.id),
      db.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).is("read_at", null)]);
    return { user, staff: (roles ?? []).some((r) => r.role !== "student"), unread: count ?? 0 };
  } catch { return { user: null, staff: false, unread: null as number | null }; }
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, staff, unread } = await session();
  const auth = user
    ? <form action="/auth/signout" method="post"><button className="btn-outline" type="submit">Sign out</button></form>
    : <a className="btn" href="/login">Sign in</a>;
  return (
    <html lang="en"><body>
      <SessionGuard />
      <a className="skip" href="#main">Skip to content</a>
      <div className="topbar"><div className="wrap">
        <div className="contact">
          {office.email && <a href={`mailto:${office.email}`}>{office.email}</a>}
          {office.phone && <span>{office.phone}</span>}
          {office.hours && <span>{office.hours}</span>}
          {!office.email && !office.phone && <span>Plateau State University, Bokkos</span>}
        </div>
        <div className="links">
          {user && <span>Signed in as {user.email}</span>}
          {user && <a href="/account">My account</a>}
          {unread !== null && <a href="/notifications">Notifications{unread > 0 ? ` (${unread})` : ""}</a>}
          {staff && <a href="/staff">Staff tools</a>}
          {!user && <a href="/login?next=/staff">Staff sign in</a>}
        </div></div></div>
      <header className="header"><div className="wrap">
        <a href="/" aria-label="Student Affairs home" style={{ textDecoration: "none" }}><Logo /></a>
        <nav className="nav desktop" aria-label="Main">
          <a href="/">Home</a>
          <div className="dropdown"><button aria-haspopup="true">About ▾</button>
            <div className="panel"><a href="/about"><strong>About us</strong><span>Who we are and what we do</span></a>
              <a href="/team"><strong>Our team</strong><span>The people behind Student Affairs</span></a></div></div>
          <div className="dropdown"><button aria-haspopup="true">Units ▾</button>
            <div className="panel"><a href="/units"><strong>All units</strong><span>The six units of Student Affairs</span></a>
              {units.map((u) => <a key={u.slug} href={`/units/${u.slug}`}><strong>{u.name}</strong></a>)}</div></div>
          <div className="dropdown"><button aria-haspopup="true">Services ▾</button>
            <div className="panel">{services.map(([t, d, h]) => <a key={h} href={h}><strong>{t}</strong><span>{d}</span></a>)}</div></div>
          <a href="/news">News</a><a href="/faq">FAQ</a><a href="/contact">Contact</a>
        </nav>
        <div className="actions">{auth}</div>
        <details className="mobile-menu" style={{ border: 0, padding: 0, margin: 0, background: "none", boxShadow: "none" }}><summary>Menu</summary>
          <nav aria-label="Mobile">
            <a href="/">Home</a><a href="/about">About us</a><a href="/team">Our team</a><a href="/units">All units</a>{units.map((u) => <a key={u.slug} href={`/units/${u.slug}`}>&nbsp;&nbsp;{u.name}</a>)}{services.map(([t, , h]) => <a key={h} href={h}>{t}</a>)}
            <a href="/news">News</a><a href="/faq">FAQ</a><a href="/contact">Contact</a>
            <div style={{ paddingTop: ".8rem" }}>{auth}</div></nav></details>
      </div></header>
      <div id="main" style={{ flex: 1 }}><PageBanner />{children}</div>
      <Footer />
    </body></html>
  );
}
