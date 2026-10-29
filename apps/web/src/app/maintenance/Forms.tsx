"use client";
import { useState } from "react";
export function ReportForm() {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/maintenance/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json(); setOk(r.ok); setMsg(j.error ?? "Reported."); if (r.ok) setTimeout(() => location.reload(), 700);
  }
  return (<form onSubmit={submit}>
    <label>What kind of fault?<select className="field" name="category" required><option value="">Select</option><option>Plumbing and water</option><option>Electrical and lighting</option><option>Furniture and beds</option><option>Doors, windows, and locks</option><option>Cleaning and pests</option><option>Other</option></select></label>
    <label>Describe the problem<textarea className="field" name="description" rows={3} placeholder="The tap in room 12 has been leaking since Monday" required /></label>
    <button className="btn" type="submit">Report fault</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</form>);
}
export function CommentForm({ ticketId }: { ticketId: string }) {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const body = String(new FormData(e.currentTarget).get("body") ?? "");
    const r = await fetch("/api/maintenance/comment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticket_id: ticketId, body }) });
    if (r.ok) location.reload(); else setMsg((await r.json()).error);
  }
  return (<form onSubmit={submit} style={{ display: "flex", gap: ".4rem", marginTop: ".5rem" }}><input className="field" style={{ margin: 0 }} name="body" placeholder="Add a message" aria-label="Add a message" /><button className="btn-outline" type="submit">Send</button>{msg && <span className="err" role="alert">{msg}</span>}</form>);
}
