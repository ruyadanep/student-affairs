"use client";
export default function Resubmit({ step }: { step: string }) {
  async function go() { const r = await fetch("/api/clearance/resubmit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ step }) }); if (r.ok) location.reload(); else alert((await r.json()).error); }
  return <button className="btn-outline" style={{ marginTop: ".4rem" }} onClick={go}>I've sorted this out, review again</button>;
}
