import { getHero, getNotices } from "@/lib/sanity";
import { units } from "@/lib/units";
import { supabaseServer } from "@/lib/supabase/server";
const services = [
  ["Hostel accommodation", "Apply, check payment status, and see your allocation.", "/hostels"],
  ["Clearance", "Track every unit you need to be cleared by.", "/clearance"],
  ["Student organisations", "Register a club or society, or find one to join.", "/organisations"],
  ["Letters and attestations", "Request a letter and verify it with its QR code.", "/letters"],
  ["Hostel maintenance", "Report a fault in your room and follow the fix.", "/maintenance"],
  ["Notifications", "Notices sent to your hall, level or faculty.", "/notifications"],
];
const quick: [string, string, string][] = [["Apply for a hostel", "Check payment and get a bed", "/hostels"], ["Start clearance", "Six units, one tracker", "/clearance"], ["Request a letter", "With a QR code to verify", "/letters"], ["Report a fault", "Hostel maintenance", "/maintenance"], ["Get support", "Counselling and welfare", "/support"], ["Verify a document", "Scan or enter its code", "/verify"]];
async function counts() {
  try {
    const db = await supabaseServer();
    const c = async (t: string) => { const { count, error } = await db.from(t).select("*", { count: "exact", head: true }); return error ? 0 : count ?? 0; };
    const [hostels, beds, orgs] = await Promise.all([c("hostels"), c("bed_spaces"), c("organisations")]);
    return { hostels, beds, orgs };
  } catch { return { hostels: 0, beds: 0, orgs: 0 }; }
}
export default async function Home() {
  const [hero, news, n] = await Promise.all([getHero(), getNotices(3), counts()]);
  const stats: [string, string][] = [[String(units.length), "Student Affairs units"], ...(n.hostels ? [[String(n.hostels), "Hostels"] as [string, string]] : []), ...(n.beds ? [[String(n.beds), "Bed spaces"] as [string, string]] : []), ...(n.orgs ? [[String(n.orgs), "Student organisations"] as [string, string]] : [])]; 
  const bg = hero?.imageUrl ? `linear-gradient(rgba(6,61,36,.82),rgba(6,61,36,.82)), url(${hero.imageUrl}) center/cover` : "linear-gradient(135deg, var(--brand-deep) 0%, var(--brand) 100%)";
  return (<>
    <section className="hero" style={{ background: bg }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img className="hero-mark" src="/logo-large.png" alt="" aria-hidden="true" /><div className="inner">
      <span className="eyebrow">Plateau State University, Bokkos</span>
      <h1>{hero?.headline ?? "Your campus life, in one place"}</h1>
      <p>{hero?.subheadline ?? "Hostels, clearance, student organisations, letters and welfare services for Plateau State University students."}</p>
      <div className="cta-row"><a className="btn" href={hero?.ctaUrl ?? "/hostels"}>{hero?.ctaLabel ?? "Apply for a hostel"}</a><a className="btn-light" href="/units">Explore our units</a></div></div></section>
    <div className="quick"><div className="quick-grid">{quick.map(([t, d, h]) => <a key={h} href={h}><strong>{t}</strong><span>{d}</span></a>)}</div></div>
    <main id="services"><div className="section-head"><h2>Student Affairs services</h2></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(16rem,1fr))", gap: "1rem" }}>
        {services.map(([t, d, h]) => (<a key={h} href={h} className="card" style={{ margin: 0, textDecoration: "none", color: "var(--ink)" }}><strong style={{ color: "var(--brand)" }}>{t}</strong><p style={{ margin: ".3rem 0 0" }}>{d}</p></a>))}</div>
      <div className="section-head"><h2>Our units</h2><a className="more" href="/units">All units →</a></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(14rem,1fr))", gap: "1rem" }}>
        {units.map((u) => (<a key={u.slug} href={`/units/${u.slug}`} className="card" style={{ margin: 0, textDecoration: "none", color: "var(--ink)" }}><strong style={{ color: "var(--brand)" }}>{u.name}</strong><p style={{ margin: ".3rem 0 0" }}>{u.summary}</p></a>))}</div>
      <div className="section-head"><h2>How it works</h2></div>
      <ol className="steps">
        <li><strong>Create your account</strong><p style={{ margin: ".3rem 0 0" }}>Register with your matric number and email. You only need to do this once.</p></li>
        <li><strong>Use the services</strong><p style={{ margin: ".3rem 0 0" }}>Apply for a hostel, start clearance, request a letter, or join a club from your phone.</p></li>
        <li><strong>Track and get notified</strong><p style={{ margin: ".3rem 0 0" }}>See every request's status and get notices for your hall, level, or faculty.</p></li>
      </ol>
      {!!news.length && (<><div className="section-head"><h2>Latest news</h2><a className="more" href="/news">All news →</a></div>
        {news.map((n: any) => (<div className="card" key={n.slug}><a href={`/news/${n.slug}`}><strong>{n.title}</strong></a>{n.date && <div><small>{new Date(n.date).toDateString()}</small></div>}{n.summary && <p style={{ margin: ".3rem 0 0" }}>{n.summary}</p>}</div>))}
        </>)}
      <div className="cta" style={{ marginTop: "3rem" }}>
        <div><h2>Need help?</h2><p>Read the frequently asked questions, or send the office a message and we will reply.</p></div>
        <div className="cta-row"><a className="btn" href="/contact">Contact us</a><a className="btn-light" href="/faq">Read the FAQ</a></div></div>
    </main>
    {stats.length >= 3 && <section className="stats" aria-label="At a glance"><div className="stats-grid">{stats.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div></section>}</>);
}
