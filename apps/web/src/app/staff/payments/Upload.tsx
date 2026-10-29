"use client";
import { useState } from "react";
import { parseCsv } from "@/lib/csv";

type Result = { verified: number; mismatched: number; not_found: number; already_verified: number; problems: { reference: string; issue: string }[] };

export default function Upload() {
  const [rows, setRows] = useState<{ reference: string; amount: string }[]>([]);
  const [min, setMin] = useState("0");
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    setRes(null); setErr("");
    const file = e.target.files?.[0]; if (!file) return;
    const grid = parseCsv(await file.text()).filter((r) => r.some((c) => c.trim()));
    if (grid.length < 2) { setErr("The file has no rows."); return; }
    const head = grid[0].map((h) => h.trim().toLowerCase());
    const ri = head.findIndex((h) => /ref/.test(h)), ai = head.findIndex((h) => /amount|paid/.test(h));
    if (ri < 0 || ai < 0) { setErr("The first row must have a 'reference' column and an 'amount' column."); return; }
    setRows(grid.slice(1).map((r) => ({ reference: (r[ri] ?? "").trim(), amount: (r[ai] ?? "").replace(/[^0-9.]/g, "") })).filter((r) => r.reference));
  }
  async function run() {
    setBusy(true); setErr(""); setRes(null);
    const r = await fetch("/api/staff/rpc", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fn: "reconcile_payments", args: { p_rows: rows, p_min: Number(min) || 0 } }) });
    const j = await r.json().catch(() => ({})); setBusy(false);
    if (!r.ok) setErr(j.error ?? "Failed."); else setRes(j.data);
  }
  return (
    <div className="space-y-4">
      <input type="file" accept=".csv,text/csv" onChange={pick} className="block text-sm" />
      {rows.length > 0 && (
        <>
          <p className="text-sm">{rows.length} payment rows read.</p>
          <label className="block text-sm">Minimum amount (₦) — rows below this are not verified
            <input value={min} onChange={(e) => setMin(e.target.value)} inputMode="decimal" className="ml-2 w-32 rounded border px-2 py-1" /></label>
          <button onClick={run} disabled={busy} className="btn">{busy ? "Checking…" : "Verify matching payments"}</button>
        </>
      )}
      {err && <p className="text-sm text-red-700">{err}</p>}
      {res && (
        <div className="rounded border p-3 text-sm">
          <p><b>{res.verified}</b> verified · <b>{res.already_verified}</b> already verified · <b>{res.mismatched}</b> amount problems · <b>{res.not_found}</b> not found</p>
          {res.problems.length > 0 && <ul className="mt-2 list-disc pl-5">{res.problems.map((p, i) => <li key={i}>{p.reference}: {p.issue}</li>)}</ul>}
        </div>
      )}
    </div>
  );
}
