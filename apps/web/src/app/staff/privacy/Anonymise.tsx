"use client";
import { useState } from "react";
export default function Anonymise() {
  const [m, setM] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const matric = String(new FormData(e.currentTarget).get("matric") ?? "");
    if (!window.confirm(`Permanently anonymise ${matric}? This cannot be undone.`)) return;
    setBusy(true);
    const r = await fetch("/api/staff/anonymise", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ matric }) });
    const j = await r.json().catch(() => ({})); setBusy(false); setM(r.ok ? "Done. The student is anonymised and can no longer sign in." : j.error ?? "Failed.");
  }
  return (<form onSubmit={go} className="flex flex-wrap items-end gap-2 text-sm"><label>Matric number <input name="matric" required className="ml-2 rounded border px-2 py-1" /></label>
    <button disabled={busy} className="rounded bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60">Anonymise</button>{m && <p role="status" className="w-full">{m}</p>}</form>);
}
