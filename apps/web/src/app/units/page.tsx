import { supabaseServer } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";
import { photoUrl } from "@/lib/staffPhoto";
import { units } from "@/lib/units";

export const metadata = { title: "Our units", description: "The six units of the Student Affairs directorate at Plateau State University, Bokkos." };

export default async function Units() {
  let team: { id: string; full_name: string; title: string | null; unit: string | null; photo_path: string | null; updated_at: string | null }[] = [];
  try {
    const db = await supabaseServer();
    const { data } = await db.from("staff_members").select("id,full_name,title,unit,photo_path,updated_at").eq("published", true).order("sort_order").order("full_name");
    team = data ?? [];
  } catch { /* the page still works without the team list */ }
  return (<main><h1>Our units</h1>
    <p>Student Affairs is made up of six units. Each one handles a different part of student life, and together they clear you at the end of your studies.</p>
    <nav aria-label="Units" style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", margin: "1rem 0 0" }}>{units.map((u) => <a key={u.slug} className="btn-outline" href={`#${u.slug}`}>{u.name}</a>)}</nav>
    {units.map((u) => { const people = team.filter((m) => (m.unit ?? "").trim().toLowerCase() === u.name.toLowerCase()); return (
      <section key={u.slug} id={u.slug} className="card" style={{ marginTop: "1.5rem", scrollMarginTop: "6rem" }}>
        <h2 style={{ marginTop: 0 }}>{u.name}</h2>
        <p>{u.summary}</p>
        <ul style={{ paddingLeft: "1.1rem" }}>{u.services.map((s) => <li key={s}>{s}</li>)}</ul>
        {u.link && <p><a className="btn" href={u.link[1]}>{u.link[0]}</a></p>}
        {people.length > 0 && (<><h3>Staff</h3><div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {people.map((m) => (<a key={m.id} href={`/team/${m.id}`} style={{ display: "flex", alignItems: "center", gap: ".6rem", textDecoration: "none", color: "var(--ink)" }}>
            <Avatar name={m.full_name} url={photoUrl(m.photo_path, m.updated_at)} size={48} /><span><strong style={{ color: "var(--brand)" }}>{m.full_name}</strong>{m.title && <><br /><small>{m.title}</small></>}</span></a>))}</div></>)}
      </section>); })}
  </main>);
}
