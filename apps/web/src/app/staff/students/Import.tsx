"use client";
import { useState } from "react";
export default function Import() {
  const [csv, setCsv] = useState(""); const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function send() {
    const r = await fetch("/api/staff/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ csv }) });
    const j = await r.json(); setOk(r.ok); setMsg(r.ok ? `Imported ${j.imported} students${j.skipped ? `, skipped ${j.skipped} rows with no matric number or name` : ""}.` : j.error);
  }
  return (<div className="card">
    <label>Choose a CSV file<input className="field" type="file" accept=".csv,text/csv" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setCsv(await f.text()); }} /></label>
    <p style={{ margin: "0 0 .6rem" }}><small>{csv ? `${csv.split(/\r?\n/).filter(Boolean).length - 1} rows ready` : "No file chosen"}</small></p>
    <button className="btn" disabled={!csv} onClick={send}>Import students</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</div>);
}
