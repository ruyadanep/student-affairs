"use client";
export default function Actions({ id, status }: { id: string; status: string }) {
  async function go(body: object) { const r = await fetch("/api/staff/maintenance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...body }) }); if (r.ok) location.reload(); else alert((await r.json()).error); }
  return (<div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
    {status === "open" && <button className="btn" onClick={() => go({ action: "assign" })}>Take this</button>}
    {(status === "assigned" || status === "open") && <button className="btn-outline" onClick={() => go({ action: "status", status: "in_progress" })}>Start fixing</button>}
    {status !== "resolved" && <button className="btn-outline" onClick={() => go({ action: "status", status: "resolved" })}>Mark fixed</button>}
    {status === "resolved" && <button className="btn-outline" onClick={() => go({ action: "status", status: "closed" })}>Close</button>}</div>);
}
