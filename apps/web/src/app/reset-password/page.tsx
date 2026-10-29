"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Reset() {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const p = String(f.get("password")), c = String(f.get("confirm"));
    if (p.length < 8) { setOk(false); return setMsg("Use a password of at least 8 characters."); }
    if (p !== c) { setOk(false); return setMsg("The two passwords don't match."); }
    const { error } = await supabaseBrowser().auth.updateUser({ password: p });
    if (error) { setOk(false); return setMsg("The link may have expired. Request a new reset link."); }
    setOk(true); setMsg("Password changed. Taking you to your account."); setTimeout(() => (location.href = "/hostels"), 1200);
  }
  return (<main style={{ maxWidth: "26rem" }}><h1>Choose a new password</h1>
    <form onSubmit={submit}><label>New password<input className="field" name="password" type="password" minLength={8} required /></label>
      <label>Confirm password<input className="field" name="confirm" type="password" minLength={8} required /></label>
      <button className="btn" type="submit">Change password</button>{msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</form></main>);
}
