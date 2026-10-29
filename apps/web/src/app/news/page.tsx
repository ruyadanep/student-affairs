import { getNotices } from "@/lib/sanity";
export const metadata = { title: "News and notices" };
export default async function News() {
  const items = await getNotices(50);
  return (<main><h1>News and notices</h1>
    {!items.length && <p>No news has been posted yet.</p>}
    {items.map((n: any) => (<div className="card" key={n.slug}><a href={`/news/${n.slug}`}><strong>{n.title}</strong></a>{n.date && <div><small>{new Date(n.date).toDateString()}</small></div>}{n.summary && <p style={{ margin: ".3rem 0 0" }}>{n.summary}</p>}</div>))}</main>);
}
