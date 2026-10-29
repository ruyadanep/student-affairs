import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import RpcForm from "@/components/RpcForm";

export const metadata = { title: "Manage elections" };
type Row = { position_title: string; candidate_name: string; votes: number };
const next: Record<string, [string, string] | undefined> = { draft: ["open", "Open voting"], open: ["closed", "Close voting"], closed: ["published", "Publish results"] };

export default async function Page() {
  const { db } = await requireRole(["dean_office"], "/staff/elections");
  const { data: elections } = await db.from("elections").select("id,title,status,opens_at,closes_at").order("created_at", { ascending: false });
  const cards = await Promise.all((elections ?? []).map(async (e: { id: string; title: string; status: string; opens_at: string | null; closes_at: string | null }) => {
    const { data: pos } = await db.from("election_positions").select("id,title,election_candidates(id,name)").eq("election_id", e.id).order("seq");
    const turn = (await db.rpc("election_turnout", { p_election: e.id })).data as { eligible: number; voted: number } | null;
    const res = e.status === "closed" ? (((await db.rpc("election_results", { p_election: e.id })).data ?? []) as Row[]) : [];
    return { e, pos: (pos ?? []) as { id: string; title: string; election_candidates: { id: string; name: string }[] }[], turn, res };
  }));
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <Link href="/staff" className="text-sm">← Staff tools</Link>
      <h1 className="text-2xl font-bold">Students' Union elections</h1>
      <section className="rounded border p-4"><h2 className="mb-2 font-semibold">New election</h2>
        <RpcForm fn="create_election" button="Create draft" fields={[{ name: "p_title", label: "Title", required: true }, { name: "p_opens", label: "Opens", type: "datetime-local", required: true }, { name: "p_closes", label: "Closes", type: "datetime-local", required: true }]} /></section>
      {cards.map(({ e, pos, turn, res }) => (
        <section key={e.id} className="space-y-3 rounded border p-4 text-sm">
          <h2 className="text-lg font-semibold">{e.title} <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs">{e.status}</span></h2>
          <p>Voters on roll: <b>{turn?.eligible ?? 0}</b> · Voted: <b>{turn?.voted ?? 0}</b></p>
          {pos.map((p) => <p key={p.id}><b>{p.title}:</b> {p.election_candidates.map((c) => c.name).join(", ") || "no candidates yet"}</p>)}
          {e.status === "draft" && (<div className="grid gap-4 sm:grid-cols-3">
            <RpcForm fn="add_position" hidden={{ p_election: e.id }} button="Add position" fields={[{ name: "p_title", label: "Position", required: true }]} />
            <RpcForm fn="add_candidate" button="Add candidate" fields={[{ name: "p_position", label: "Position", type: "select", options: pos.map((p) => [p.id, p.title] as [string, string]) },
              { name: "p_name", label: "Name", required: true }, { name: "p_matric", label: "Matric no." }, { name: "p_manifesto", label: "Manifesto", type: "textarea" }]} />
            <RpcForm fn="load_voter_roll" hidden={{ p_election: e.id }} button="Load voter roll" fields={[{ name: "p_level", label: "Level (blank = all)", type: "number" }, { name: "p_faculty", label: "Faculty (blank = all)" }]} />
          </div>)}
          {res.length > 0 && <ul className="rounded border p-2">{res.map((r, i) => <li key={i}>{r.position_title}: {r.candidate_name}: {r.votes}</li>)}</ul>}
          {next[e.status] && <RpcForm fn="set_election_state" hidden={{ p_election: e.id, p_state: next[e.status]![0] }} fields={[]} button={next[e.status]![1]} confirmText={`${next[e.status]![1]}? This cannot be undone.`} />}
        </section>))}
    </main>
  );
}
