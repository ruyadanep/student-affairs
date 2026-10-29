"use client";
export default function JoinButton({ id, joined }: { id: string; joined: boolean }) {
  async function go() { const r = await fetch("/api/organisations/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ organisation_id: id, action: joined ? "leave" : "join" }) }); if (r.ok) location.reload(); else alert((await r.json()).error); }
  return <button className={joined ? "btn-outline" : "btn"} onClick={go}>{joined ? "Leave" : "Join"}</button>;
}
