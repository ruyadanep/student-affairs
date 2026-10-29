import { getHero, getNotices } from "@/lib/sanity";
const services = [
  ["Hostel accommodation", "Apply, check payment status, and see your allocation.", "/hostels"],
  ["Clearance", "Track every unit you need to be cleared by.", "/clearance"],
  ["Student organisations", "Register a club or society, or find one to join.", "/organisations"],
  ["Letters and attestations", "Request a letter and verify it with its QR code.", "/letters"],
  ["Hostel maintenance", "Report a fault in your room and follow the fix.", "/maintenance"],
  ["Notifications", "Notices sent to your hall, level or faculty.", "/notifications"],
];
export default async function Home() {
  const [hero, news] = await Promise.all([getHero(), getNotices(3)]);
  const bg = hero?.imageUrl ? `linear-gradient(rgba(6,61,36,.82),rgba(6,61,36,.82)), url(${hero.imageUrl}) center/cover` : "linear-gradient(135deg, var(--brand-deep) 0%, var(--brand) 100%)";
  return (<>
    <section className="hero" style={{ background: bg }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img className="hero-mark" src="/logo-large.png" alt="" aria-hidden="true" /><div className="inner">
      <h1>{hero?.headline ?? "Your campus life, in one place"}</h1>
      <p>{hero?.subheadline ?? "Hostels, clearance, student organisations, letters and welfare services for Plateau State University students."}</p>
      <a className="btn" href={hero?.ctaUrl ?? "/hostels"}>{hero?.ctaLabel ?? "Apply for a hostel"}</a></div></section>
    <main id="services"><h2>Student Affairs services</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(16rem,1fr))", gap: "1rem" }}>
        {services.map(([t, d, h]) => (<a key={h} href={h} className="card" style={{ margin: 0, textDecoration: "none", color: "var(--ink)" }}><strong style={{ color: "var(--brand)" }}>{t}</strong><p style={{ margin: ".3rem 0 0" }}>{d}</p></a>))}</div>
      <h2 style={{ marginTop: "2.5rem" }}>How it works</h2>
      <ol className="steps">
        <li><strong>Create your account</strong><p style={{ margin: ".3rem 0 0" }}>Register with your matric number and email. You only need to do this once.</p></li>
        <li><strong>Use the services</strong><p style={{ margin: ".3rem 0 0" }}>Apply for a hostel, start clearance, request a letter, or join a club from your phone.</p></li>
        <li><strong>Track and get notified</strong><p style={{ margin: ".3rem 0 0" }}>See every request's status and get notices for your hall, level, or faculty.</p></li>
      </ol>
      {!!news.length && (<><h2 style={{ marginTop: "2.5rem" }}>Latest news</h2>
        {news.map((n: any) => (<div className="card" key={n.slug}><a href={`/news/${n.slug}`}><strong>{n.title}</strong></a>{n.date && <div><small>{new Date(n.date).toDateString()}</small></div>}{n.summary && <p style={{ margin: ".3rem 0 0" }}>{n.summary}</p>}</div>))}
        <p><a href="/news">All news</a></p></>)}
      <div className="card" style={{ marginTop: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div><strong style={{ color: "var(--brand)" }}>Need help?</strong><p style={{ margin: ".2rem 0 0" }}>Read the <a href="/faq">frequently asked questions</a> or send the office a message.</p></div>
        <a className="btn" href="/contact">Contact us</a></div>
    </main></>);
}
