"use client";
import { useState } from "react";
export function RequestForm() {
  const [kind, setKind] = useState("counselling"); const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/support/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json(); setOk(r.ok); setMsg(j.error ?? "Sent. We'll update you here."); if (r.ok) setTimeout(() => location.reload(), 900);
  }
  return (<form onSubmit={submit}>
    <label>What do you need?<select className="field" name="kind" value={kind} onChange={(e) => setKind(e.target.value)}>
      <option value="counselling">A counselling appointment</option><option value="special_needs">Accessibility or special-needs support</option>
      <option value="complaint">To make a complaint</option><option value="hardship">Emergency or financial hardship support</option></select></label>
    <label>Subject<input className="field" name="subject" maxLength={150} required /></label>
    <label>Tell us more<textarea className="field" name="details" rows={5} maxLength={4000} required /></label>
    {kind === "counselling" && <label>Days and times that suit you<input className="field" name="preferred_times" placeholder="Weekday afternoons" /></label>}
    <button className="btn" type="submit">Send request</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</form>);
}
export function MessageForm({ requestId }: { requestId: string }) {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const body = String(new FormData(e.currentTarget).get("body") ?? "");
    const r = await fetch("/api/support/message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ request_id: requestId, body }) });
    if (r.ok) location.reload(); else setMsg((await r.json()).error);
  }
  return (<form onSubmit={submit} style={{ display: "flex", gap: ".4rem", marginTop: ".5rem" }}><input className="field" style={{ margin: 0 }} name="body" placeholder="Add a message" aria-label="Add a message" /><button className="btn-outline" type="submit">Send</button>{msg && <span className="err" role="alert">{msg}</span>}</form>);
}
