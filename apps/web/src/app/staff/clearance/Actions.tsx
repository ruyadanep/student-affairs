"use client";
export default function Actions({ step, blocked }: { step: string; blocked: boolean }) {
  async function send(approve: boolean) {
    let reason: string | null = null;
    if (!approve) { reason = prompt("Reason for returning this clearance"); if (!reason) return; }
    const r = await fetch("/api/staff/clearance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ step, approve, reason }) });
    if (r.ok) location.reload(); else alert((await r.json()).error);
  }
  return (<div style={{ display: "flex", gap: ".4rem" }}>
    <button className="btn" disabled={blocked} title={blocked ? "Waiting on earlier units" : ""} onClick={() => send(true)}>Approve</button>
    <button className="btn-outline" onClick={() => send(false)}>Return</button></div>);
}
