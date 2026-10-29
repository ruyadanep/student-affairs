import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";
import { photoUrl } from "@/lib/staffPhoto";
export default async function Member({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = await supabaseServer();
  const { data: m } = await db.from("staff_members").select("*").eq("id", id).eq("published", true).maybeSingle();
  if (!m) notFound();
  return (<main style={{ maxWidth: "46rem" }}><p><a href="/team">All team members</a></p>
    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
      <Avatar name={m.full_name} url={photoUrl(m.photo_path, m.updated_at)} size={168} />
      <div><h1 style={{ margin: 0 }}>{m.full_name}</h1>{m.title && <p style={{ margin: ".2rem 0 0", fontWeight: 600 }}>{m.title}</p>}{m.unit && <p style={{ margin: 0 }}><small>{m.unit}</small></p>}
        {m.email && <p style={{ margin: ".5rem 0 0" }}><a href={`mailto:${m.email}`}>{m.email}</a></p>}{m.phone && <p style={{ margin: 0 }}>{m.phone}</p>}</div></div>
    {m.bio && <p style={{ whiteSpace: "pre-line" }}>{m.bio}</p>}</main>);
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; if (!/^[0-9a-f-]{36}$/i.test(id)) return { title: "Our team" };
  const db = await supabaseServer(); const { data } = await db.from("staff_members").select("full_name").eq("id", id).eq("published", true).maybeSingle();
  return { title: data?.full_name ?? "Our team" };
}
