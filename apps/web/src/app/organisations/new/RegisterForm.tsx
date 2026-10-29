"use client";
import { useState } from "react";
export default function RegisterForm() {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/organisations/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json(); setOk(r.ok); setMsg(j.error ?? "Submitted for review."); if (r.ok) setTimeout(() => (location.href = "/organisations"), 900);
  }
  return (<form onSubmit={submit}>
    <label>Name<input className="field" name="name" required /></label>
    <label>Category<select className="field" name="category"><option value="">Select</option><option>Academic</option><option>Faith-based</option><option>Cultural</option><option>Sports</option><option>Professional</option><option>Community service</option><option>Arts and media</option><option>Other</option></select></label>
    <label>What does it do?<textarea className="field" name="description" rows={4} required /></label>
    <button className="btn" type="submit">Submit for review</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</form>);
}
