import { office } from "@/lib/site";
const services: [string, string][] = [["Hostel accommodation", "/hostels"], ["Clearance", "/clearance"], ["Student organisations", "/organisations"], ["Letters and attestations", "/letters"], ["Hostel maintenance", "/maintenance"], ["Welfare and support", "/support"], ["Events", "/events"], ["Elections", "/elections"], ["Lost and found", "/lost-found"]];
const info: [string, string][] = [["About Student Affairs", "/about"], ["Our units", "/units"], ["Our team", "/team"], ["News and notices", "/news"], ["Frequently asked questions", "/faq"], ["Verify a document", "/verify"], ["Contact us", "/contact"], ["Privacy notice", "/privacy"]];
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginBottom: ".8rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={48} height={48} />
            <div style={{ lineHeight: 1.15 }}><div style={{ fontSize: ".75rem", letterSpacing: ".04em", textTransform: "uppercase", opacity: 0.8 }}>Plateau State University</div><strong style={{ textTransform: "uppercase" }}>Student Affairs</strong></div>
          </div>
          <p style={{ margin: 0, opacity: 0.85 }}>Supporting students with accommodation, clearance, clubs and societies, letters, and welfare.</p>
        </div>
        <nav aria-label="Services"><h2>Services</h2><ul>{services.map(([t, h]) => <li key={h}><a href={h}>{t}</a></li>)}</ul></nav>
        <nav aria-label="Information"><h2>Information</h2><ul>{info.map(([t, h]) => <li key={h}><a href={h}>{t}</a></li>)}</ul></nav>
        <div><h2>Office</h2>
          <p style={{ margin: "0 0 .4rem" }}>{office.address}</p>
          {office.email && <p style={{ margin: "0 0 .4rem" }}><a href={`mailto:${office.email}`}>{office.email}</a></p>}
          {office.phone && <p style={{ margin: "0 0 .4rem" }}>{office.phone}</p>}
          {office.hours && <p style={{ margin: "0 0 .4rem" }}>{office.hours}</p>}
          <p style={{ margin: ".8rem 0 0" }}><a className="btn" href="/contact">Send a message</a></p></div>
      </div>
      <div className="footer-base">© {new Date().getFullYear()} Plateau State University, Bokkos. Division of Student Affairs.</div>
    </footer>
  );
}
