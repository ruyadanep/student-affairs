"use client";
import { useState } from "react";
export default function Prefs({ email, sms, phone }: { email: boolean; sms: boolean; phone: string }) {
  const [e, setE] = useState(email), [s, setS] = useState(sms), [p, setP] = useState(phone);
  const [m, setM] = useState<{ ok: boolean; t: string } | null>(null);
  async function save(ev: React.FormEvent) {
    ev.preventDefault(); setM(null);
    const r = await fetch("/api/account/alerts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: e, sms: s, phone: p }) });
    const j = await r.json().catch(() => ({})); setM(r.ok ? { ok: true, t: "Saved." } : { ok: false, t: j.error ?? "Failed." });
  }
  return (
    <form onSubmit={save} className="space-y-3 text-sm">
      <label className="flex items-center gap-2"><input type="checkbox" checked={e} onChange={(x) => setE(x.target.checked)} /> Email me important notices</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={s} onChange={(x) => setS(x.target.checked)} /> Text me important notices (SMS)</label>
      <label className="block">Phone number <input value={p} onChange={(x) => setP(x.target.value)} inputMode="tel" placeholder="08012345678" className="ml-2 rounded border px-2 py-1" /></label>
      <button className="rounded bg-[#0b5c36] px-4 py-2 font-semibold text-white">Save</button>
      {m && <p role="status" className={m.ok ? "text-green-800" : "text-red-700"}>{m.t}</p>}
    </form>
  );
}
