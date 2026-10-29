import { supabaseServer } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";
import { photoUrl } from "@/lib/staffPhoto";
export const metadata = { title: "Our team" };
export default async function Team() {
  const db = await supabaseServer();
  const { data } = await db.from("staff_members").select("id,full_name,title,unit,photo_path,updated_at").eq("published", true).order("sort_order").order("full_name");
  return (<main><h1>Our team</h1><p>The people behind Student Affairs at Plateau State University, Bokkos.</p>
    {!data?.length && <p>Team profiles will appear here soon.</p>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(14rem,1fr))", gap: "1rem" }}>
      {(data ?? []).map((m) => (<a key={m.id} href={`/team/${m.id}`} className="card" style={{ margin: 0, textAlign: "center", textDecoration: "none", color: "var(--ink)" }}>
        <div style={{ display: "grid", placeItems: "center", marginBottom: ".8rem" }}><Avatar name={m.full_name} url={photoUrl(m.photo_path, m.updated_at)} size={128} /></div>
        <strong style={{ color: "var(--brand)" }}>{m.full_name}</strong>{m.title && <div>{m.title}</div>}{m.unit && <small>{m.unit}</small>}</a>))}</div></main>);
}
