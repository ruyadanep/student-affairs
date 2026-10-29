"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type P = { id: string; title: string; election_candidates: { id: string; name: string; manifesto: string | null }[] };
export default function Vote({ electionId, positions }: { electionId: string; positions: P[] }) {
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!window.confirm("Submit your vote? You cannot change it afterwards.")) return;
    const f = new FormData(e.currentTarget); const choices: Record<string, string> = {};
    for (const p of positions) choices[p.id] = String(f.get(p.id) || "abstain");
    setBusy(true);
    const r = await fetch("/api/staff/rpc", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fn: "cast_votes", args: { p_election: electionId, p_choices: choices } }) });
    const j = await r.json().catch(() => ({})); setBusy(false);
    if (!r.ok) setMsg(j.error ?? "Your vote could not be recorded."); else router.refresh();
  }
  return (
    <form onSubmit={submit} className="space-y-6">
      {positions.map((p) => (
        <fieldset key={p.id} className="rounded border p-4"><legend className="px-1 font-semibold">{p.title}</legend>
          {p.election_candidates.map((c) => (<label key={c.id} className="mt-2 block text-sm"><input type="radio" name={p.id} value={c.id} className="mr-2" /><b>{c.name}</b>{c.manifesto && <span className="block pl-6 text-gray-700">{c.manifesto}</span>}</label>))}
          <label className="mt-2 block text-sm"><input type="radio" name={p.id} value="abstain" defaultChecked className="mr-2" />Abstain</label></fieldset>))}
      <button disabled={busy} className="btn">{busy ? "Submitting…" : "Submit my vote"}</button>
      {msg && <p role="alert" className="text-sm text-red-700">{msg}</p>}
    </form>
  );
}
