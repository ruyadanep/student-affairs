"use client";
export default function Actions({ id }: { id: string }) {
  async function go(approve: boolean) {
    let note: string | null = null;
    if (!approve) { note = prompt("Reason for rejecting this organisation"); if (!note) return; }
    const r = await fetch("/api/staff/organisations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, approve, note }) });
    if (r.ok) location.reload(); else alert((await r.json()).error);
  }
  return (<div style={{ display: "flex", gap: ".4rem" }}><button className="btn" onClick={() => go(true)}>Approve</button><button className="btn-outline" onClick={() => go(false)}>Reject</button></div>);
}
