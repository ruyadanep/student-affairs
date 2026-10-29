"use client";
import { useState } from "react";
type H = { id: string; name: string; gender: string };
export default function ApplyForm({ hostels, needsPayment }: { hostels: H[]; needsPayment: boolean }) {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/hostel/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json(); setOk(r.ok); setMsg(j.error ?? j.note ?? "Application submitted."); if (r.ok) setTimeout(() => location.reload(), 900);
  }
  const opts = hostels.map((h) => <option key={h.id} value={h.id}>{h.name} ({h.gender})</option>);
  return (<form onSubmit={submit}>
    <label>First choice<select className="field" name="preference_1" required><option value="">Select a hostel</option>{opts}</select></label>
    <label>Second choice<select className="field" name="preference_2"><option value="">None</option>{opts}</select></label>
    {needsPayment && <label>Payment receipt reference from plasu.edu.ng<input className="field" name="reference" placeholder="Reference on your receipt" required /></label>}
    <button className="btn" type="submit">Submit application</button>
    {msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}
  </form>);
}
