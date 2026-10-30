import { supabaseServer } from "@/lib/supabase/server";
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(18rem,1fr))", gap: "1rem", marginTop: "1.5rem" }}>
      {units.map((u) => { const n = team.filter((m) => (m.unit ?? "").trim().toLowerCase() === u.name.toLowerCase()).length; return (
        <a key={u.slug} href={`/units/${u.slug}`} className="card" style={{ margin: 0, textDecoration: "none", color: "var(--ink)" }}>
          <strong style={{ color: "var(--brand)", fontSize: "1.15rem" }}>{u.name}</strong>
          <p style={{ margin: ".4rem 0" }}>{u.summary}</p>
          <small>{u.services.join(" · ")}{n > 0 ? ` · ${n} staff` : ""}</small></a>); })}</div>
  </main>);
}
