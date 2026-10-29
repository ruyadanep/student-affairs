"use client";
export default function Actions({ id, status }: { id: string; status: string }) {
  async function post(body: object) { const r = await fetch("/api/staff/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...body }) }); if (r.ok) location.reload(); else alert((await r.json()).error); }
  async function schedule(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); post({ action: "schedule", scheduled_at: String(new FormData(e.currentTarget).get("when")) }); }
  return (<div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", alignItems: "center" }}>
    {status === "submitted" && <button className="btn-outline" onClick={() => post({ action: "status", status: "in_review" })}>Start review</button>}
    <form onSubmit={schedule} style={{ display: "flex", gap: ".3rem" }}><input className="field" style={{ margin: 0, width: "auto" }} type="datetime-local" name="when" aria-label="Appointment date and time" required /><button className="btn" type="submit">Set appointment</button></form>
    <button className="btn-outline" onClick={() => { const note = prompt("Optional note for the student"); post({ action: "status", status: "resolved", note }); }}>Resolve</button>
    {status === "resolved" && <button className="btn-outline" onClick={() => post({ action: "status", status: "closed" })}>Close</button>}</div>);
}
