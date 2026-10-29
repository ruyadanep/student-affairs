"use client";
import { useState } from "react";
export default function StartButton() {
  const [msg, setMsg] = useState("");
  async function go() { const r = await fetch("/api/clearance/start", { method: "POST" }); if (r.ok) location.reload(); else setMsg((await r.json()).error); }
  return (<><button className="btn" onClick={go}>Start clearance</button>{msg && <p className="err" role="alert">{msg}</p>}</>);
}
