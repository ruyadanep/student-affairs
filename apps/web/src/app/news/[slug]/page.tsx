import { notFound } from "next/navigation";
import { getNotice } from "@/lib/sanity";
function Body({ blocks }: { blocks: any[] }) {
  return <>{(blocks ?? []).map((b, i) => { const text = (b.children ?? []).map((c: any) => c.text).join(""); if (!text) return null;
    return ["h1", "h2"].includes(b.style) ? <h2 key={i}>{text}</h2> : ["h3", "h4"].includes(b.style) ? <h3 key={i}>{text}</h3> : <p key={i}>{text}</p>; })}</>;
}
export default async function Notice({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const n = await getNotice(slug);
  if (!n) notFound();
  return (<main style={{ maxWidth: "44rem" }}><p><a href="/news">All news</a></p><h1>{n.title}</h1>{n.date && <p><small>{new Date(n.date).toDateString()}</small></p>}<Body blocks={n.body} /></main>);
}
