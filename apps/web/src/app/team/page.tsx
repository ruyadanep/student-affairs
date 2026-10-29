import { supabaseServer } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";
import { photoUrl } from "@/lib/staffPhoto";
import { units } from "@/lib/units";
export const metadata = { title: "Our team" };
export default async function Team() {
  const db = await supabaseServer();
  const { data } = await db.from("staff_members").select("id,full_name,title,unit,photo_path,updated_at").eq("published", true).order("sort_order").order("full_name");
  const all = data ?? []; const known = new Set(units.map((u) => u.name.toLowerCase()));
  const groups: [string, typeof all][] = ([["", all.filter((m) => !known.has((m.unit ?? "").trim().toLowerCase()))] as [string, typeof all],
    ...units.map((u) => [u.name, all.filter((m) => (m.unit ?? "").trim().toLowerCase() === u.name.toLowerCase())] as [string, typeof all])] as [string, typeof all][]).filter(([, l]) => l.length > 0);
  return (<main><h1>Our team</h1><p>The people behind Student Affairs at Plateau State University, Bokkos.</p>
    {!data?.length && <p>Team profiles will appear here soon.</p>}
    {groups.map(([label, list]) => (<section key={label}>{label && <h2>{label}</h2>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(14rem,1fr))", gap: "1rem" }}>
        {list.map((m) => (<a key={m.id} href={`/team/${m.id}`} className="card" style={{ margin: 0, textAlign: "center", textDecoration: "none", color: "var(--ink)" }}>
          <div style={{ display: "grid", placeItems: "center", marginBottom: ".8rem" }}><Avatar name={m.full_name} url={photoUrl(m.photo_path, m.updated_at)} size={128} /></div>
          <strong style={{ color: "var(--brand)" }}>{m.full_name}</strong>{m.title && <div>{m.title}</div>}{m.unit && <small>{m.unit}</small>}</a>))}</div></section>))}
  </main>);
}
