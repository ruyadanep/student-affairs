"use client";
import { useState } from "react";
export default function Form() {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget;
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const j = await r.json(); setOk(r.ok); setMsg(r.ok ? "Thank you. We have your message." : j.error); if (r.ok) form.reset();
  }
  return (<form onSubmit={submit}>
    <label>Your name<input className="field" name="name" required /></label>
    <label>Email<input className="field" name="email" type="email" required /></label>
    <label>Topic<select className="field" name="topic"><option value="">Select</option><option>Hostel accommodation</option><option>Clearance</option><option>Student organisations</option><option>Letters</option><option>Welfare</option><option>Other</option></select></label>
    <label>Message<textarea className="field" name="message" rows={5} required /></label>
    <div aria-hidden style={{ position: "absolute", left: "-9999px" }}><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button className="btn" type="submit">Send message</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</form>);
}
