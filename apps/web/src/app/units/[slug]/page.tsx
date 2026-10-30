import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";
import { photoUrl } from "@/lib/staffPhoto";
import { office } from "@/lib/site";
import { units, clearanceOrder } from "@/lib/units";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const u = units.find((x) => x.slug === slug);
  return u ? { title: u.name, description: u.summary } : { title: "Unit not found" };
}

export default async function UnitPage({ params }: Props) {
  const { slug } = await params;
  const u = units.find((x) => x.slug === slug);
  if (!u) notFound();
  let people: { id: string; full_name: string; title: string | null; photo_path: string | null; updated_at: string | null }[] = [];
  try {
    const db = await supabaseServer();
    const { data } = await db.from("staff_members").select("id,full_name,title,unit,photo_path,updated_at").eq("published", true).order("sort_order").order("full_name");
    people = (data ?? []).filter((m: { unit: string | null }) => (m.unit ?? "").trim().toLowerCase() === u.name.toLowerCase());
  } catch { /* page still works without the staff list */ }
  const step = clearanceOrder.indexOf(u.name) + 1;
  return (<main>
    <h1>{u.name}</h1>
    <p style={{ fontSize: "1.2rem", marginTop: 0 }}>{u.summary}</p>

    <h2>What this unit does</h2>
    <ul style={{ paddingLeft: "1.1rem" }}>{u.services.map((s) => <li key={s}>{s}</li>)}</ul>
    {u.link && <p><a className="btn" href={u.link[1]}>{u.link[0]}</a></p>}

    {step > 0 && (<><h2>Clearance</h2>
      <p>This is step {step} of {clearanceOrder.length} when you clear at the end of your studies. {step > 1 ? `You must be cleared by ${clearanceOrder[step - 2]} first. ` : ""}<a href="/clearance">Track your clearance</a>.</p></>)}

    <h2>Contact</h2>
    <div className="card">
      <p style={{ margin: 0 }}>{office.address}</p>
      {office.email && <p style={{ margin: ".4rem 0 0" }}><a href={`mailto:${office.email}`}>{office.email}</a></p>}
      {office.phone && <p style={{ margin: ".4rem 0 0" }}>{office.phone}</p>}
      {office.hours && <p style={{ margin: ".4rem 0 0" }}>{office.hours}</p>}
      <p style={{ margin: ".8rem 0 0" }}><a className="btn-outline" href="/contact">Send the office a message</a></p></div>

    {people.length > 0 && (<><h2>Staff</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(14rem,1fr))", gap: "1rem" }}>
        {people.map((m) => (<a key={m.id} href={`/team/${m.id}`} className="card" style={{ margin: 0, textAlign: "center", textDecoration: "none", color: "var(--ink)" }}>
          <div style={{ display: "grid", placeItems: "center", marginBottom: ".8rem" }}><Avatar name={m.full_name} url={photoUrl(m.photo_path, m.updated_at)} size={96} /></div>
          <strong style={{ color: "var(--brand)" }}>{m.full_name}</strong>{m.title && <div>{m.title}</div>}</a>))}</div></>)}

    <h2>Other units</h2>
    <nav aria-label="Other units" style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
      {units.filter((x) => x.slug !== u.slug).map((x) => <a key={x.slug} className="btn-outline" href={`/units/${x.slug}`}>{x.name}</a>)}</nav>
  </main>);
}
