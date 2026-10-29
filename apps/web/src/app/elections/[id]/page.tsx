import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Vote from "./Vote";

export const dynamic = "force-dynamic";
type Res = { position_id: string; position_title: string; candidate_name: string; votes: number };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  const { data: el } = await db.from("elections").select("id,title,status,opens_at,closes_at").eq("id", id).maybeSingle();
  if (!el) notFound();
  const { data: positions } = await db.from("election_positions").select("id,title,seq,election_candidates(id,name,manifesto)").eq("election_id", id).order("seq");
  const roll = user ? (await db.from("voter_roll").select("voted_at").eq("election_id", id).eq("student_id", user.id).maybeSingle()).data : null;
  const now = Date.now();
  const live = el.status === "open" && el.opens_at && el.closes_at && now >= new Date(el.opens_at).getTime() && now <= new Date(el.closes_at).getTime();
  const results = el.status === "published" ? ((await db.rpc("election_results", { p_election: id })).data ?? []) as Res[] : [];
  const grouped = results.reduce<Record<string, Res[]>>((a, r) => { (a[r.position_title] ||= []).push(r); return a; }, {});
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link href="/elections" className="text-sm">← Elections</Link>
      <h1 className="text-2xl font-bold">{el.title}</h1>
      {el.status === "published" ? (
        Object.entries(grouped).map(([pos, rows]) => (
          <section key={pos} className="rounded border p-4"><h2 className="font-semibold">{pos}</h2>
            <ul className="mt-2 text-sm">{rows.map((r, i) => <li key={i} className="flex justify-between border-b py-1"><span>{i === 0 && r.votes > 0 ? "🏆 " : ""}{r.candidate_name}</span><span>{r.votes} votes</span></li>)}</ul></section>))
      ) : !user ? <p className="text-sm">Sign in to vote. <Link href={`/login?next=/elections/${id}`}>Sign in</Link></p>
        : !roll ? <p className="text-sm">You are not on the voter roll for this election.</p>
        : roll.voted_at ? <p className="rounded bg-green-50 p-3 text-sm text-green-900">Your vote has been recorded. Thank you.</p>
        : !live ? <p className="text-sm">Voting is not open right now.</p>
        : <Vote electionId={id} positions={(positions ?? []) as never} />}
    </main>
  );
}
