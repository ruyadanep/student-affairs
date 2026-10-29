"use client";
export default function Actions({ id }: { id: string }) {
  async function go(action: string) { const r = await fetch("/api/staff/letters", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) }); if (r.ok) location.reload(); else alert((await r.json()).error); }
  return (<div style={{ display: "flex", gap: ".4rem" }}><button className="btn" onClick={() => go("approve")}>Approve and issue</button><button className="btn-outline" onClick={() => go("reject")}>Reject</button></div>);
}
