import { getDean } from "@/lib/sanity";
const what = [["Accommodation", "Hostel allocation, room changes, and maintenance."], ["Clearance", "Step-by-step clearance through the directorate's units."], ["Student organisations", "Registration of clubs and societies."], ["Letters", "Letters of good standing, references, and attestations."], ["Welfare and support", "Counselling and student support."]];
import { units } from "@/lib/units";
export const metadata = { title: "About" };
export default async function About() {
  const dean = await getDean();
  return (<main><h1>About Student Affairs</h1>
    <p>The Division of Student Affairs supports students at Plateau State University, Bokkos, outside the classroom: where they live, the groups they join, and the services they need to complete their studies.</p>
    <p><a className="btn" href="/team">Meet the team</a></p>
    <h2>What we do</h2>
    <ul style={{ paddingLeft: "1.1rem" }}>{what.map(([t, d]) => <li key={t}><strong>{t}:</strong> {d}</li>)}</ul>
    <h2>Our units</h2>
    <p>The directorate has six units:</p>
    <ul style={{ paddingLeft: "1.1rem" }}>{units.map((u) => <li key={u.slug}><a href={`/units/${u.slug}`}><strong>{u.name}</strong></a>: {u.summary}</li>)}</ul>
    {dean && (<><h2>From the Dean</h2><div className="card" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {dean.photoUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={dean.photoUrl} alt={dean.name} width={120} height={120} style={{ borderRadius: ".5rem", objectFit: "cover" }} />}
      <div style={{ flex: "1 1 18rem" }}><strong>{dean.name}</strong><div><small>{dean.title}</small></div>{dean.message && <p style={{ whiteSpace: "pre-line" }}>{dean.message}</p>}</div></div></>)}
  </main>);
}
