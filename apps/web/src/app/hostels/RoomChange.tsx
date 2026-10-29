"use client";
import { useState } from "react";
export default function RoomChange({ allocationId, status, note }: { allocationId: string; status?: string; note?: string | null }) {
  const [msg, setMsg] = useState("");
  if (status === "submitted") return <p><span className="badge gold">Room change request waiting for review</span></p>;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const reason = String(new FormData(e.currentTarget).get("reason"));
    const r = await fetch("/api/hostel/room-change", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ allocation_id: allocationId, reason }) });
    if (r.ok) location.reload(); else setMsg((await r.json()).error);
  }
  return (<details><summary>Request a room change</summary>
    {status === "rejected" && <p className="err">Your last request wasn't approved{note ? `: ${note}` : "."}</p>}
    <form onSubmit={submit}><label>Why do you need to move?<textarea className="field" name="reason" rows={3} required /></label><button className="btn" type="submit">Send request</button>{msg && <p className="err" role="alert">{msg}</p>}</form></details>);
}
