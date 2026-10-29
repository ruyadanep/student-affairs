"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Verify() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const code = String(new FormData(e.currentTarget).get("code") ?? "").trim(); const db = supabaseBrowser();
    const { data: factors } = await db.auth.mfa.listFactors(); const factor = factors?.totp?.[0];
    if (!factor) { location.href = "/mfa/setup"; return; }
    const ch = await db.auth.mfa.challenge({ factorId: factor.id }); if (ch.error) return setMsg("Something went wrong. Try again.");
    const v = await db.auth.mfa.verify({ factorId: factor.id, challengeId: ch.data.id, code });
    if (v.error) return setMsg("That code didn't work. Use the newest code from your app.");
    const next = new URLSearchParams(location.search).get("next"); location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : "/staff";
  }
  return (<main style={{ maxWidth: "26rem" }}><h1>Two-step verification</h1><p>Open your authenticator app and enter the 6-digit code.</p>
    <form onSubmit={submit}><label>Code<input className="field" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required autoFocus /></label><button className="btn" type="submit">Verify</button></form>
    {msg && <p className="err" role="alert">{msg}</p>}</main>);
}
