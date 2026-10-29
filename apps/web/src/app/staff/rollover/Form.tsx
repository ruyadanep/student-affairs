"use client";
import { useState } from "react";
export default function Form() {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/staff/rollover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, vacate: f.vacate === "on", reset_fresh: f.reset_fresh === "on" }) });
    const j = await r.json(); setOk(r.ok); setMsg(r.ok ? `New session started. ${j.vacated} rooms released, ${j.fresh_reset} fresh-student flags reset.` : j.error);
  }
  return (<form className="card" onSubmit={submit}>
    <label>New session<input className="field" name="session" placeholder="2027/2028" required /></label>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(14rem,1fr))", gap: "0 1rem" }}>
      <label>Applications open<input className="field" type="datetime-local" name="opens_at" /></label><label>Applications close<input className="field" type="datetime-local" name="closes_at" /></label></div>
    <label style={{ marginBottom: ".6rem" }}><input type="checkbox" name="vacate" defaultChecked /> Release every current room (students must apply again)</label>
    <label style={{ marginBottom: "1rem" }}><input type="checkbox" name="reset_fresh" defaultChecked /> Clear the "fresh student" flag on everyone (import new freshers afterwards)</label>
    <label>Type the new session name again to confirm<input className="field" name="confirm" autoComplete="off" required /></label>
    <button className="btn" type="submit">Start new session</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</form>);
}
