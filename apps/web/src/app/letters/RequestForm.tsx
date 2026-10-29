"use client";
import { useState } from "react";
export default function RequestForm() {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/letters/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json(); setOk(r.ok); setMsg(j.error ?? "Request sent."); if (r.ok) setTimeout(() => location.reload(), 800);
  }
  return (<form onSubmit={submit}>
    <label>Letter type<select className="field" name="doc_type" required><option value="good_standing">Letter of good standing</option><option value="character_reference">Character reference</option><option value="attestation">Attestation letter</option><option value="other">Other</option></select></label>
    <label>What is it for?<input className="field" name="purpose" placeholder="Scholarship application" required /></label>
    <label>Addressed to (optional)<input className="field" name="addressee" placeholder="The Registrar, University of Jos" /></label>
    <button className="btn" type="submit">Request letter</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}
  </form>);
}
