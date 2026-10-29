"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Setup() {
  const [f, setF] = useState<{ id: string; qr: string; secret: string } | null>(null); const [msg, setMsg] = useState("");
  async function start() {
    const { data, error } = await supabaseBrowser().auth.mfa.enroll({ factorType: "totp", friendlyName: `Authenticator ${Date.now()}` });
    if (error || !data) return setMsg("We couldn't start setup. Try again."); setF({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }
  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const code = String(new FormData(e.currentTarget).get("code") ?? "").trim(); const db = supabaseBrowser();
    const ch = await db.auth.mfa.challenge({ factorId: f!.id }); if (ch.error) return setMsg("Something went wrong. Start again.");
    const v = await db.auth.mfa.verify({ factorId: f!.id, challengeId: ch.data.id, code });
    if (v.error) return setMsg("That code didn't work. Check the time on your phone and try the newest code.");
    const next = new URLSearchParams(location.search).get("next"); location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : "/staff/security";
  }
  return (<main style={{ maxWidth: "30rem" }}><h1>Set up two-step verification</h1>
    <p>You'll use an authenticator app (such as Google Authenticator, Microsoft Authenticator, or Authy) to get a 6-digit code each time you sign in.</p>
    {!f ? <button className="btn" onClick={start}>Start setup</button> : (<>
      <ol><li>Scan this QR code with your authenticator app.</li></ol>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={f.qr} alt="QR code for your authenticator app" width={200} height={200} />
      <p><small>Can't scan? Enter this key in the app: <code>{f.secret}</code></small></p>
      <form onSubmit={verify}><label>Enter the 6-digit code<input className="field" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required /></label><button className="btn" type="submit">Confirm</button></form></>)}
    {msg && <p className="err" role="alert">{msg}</p>}</main>);
}
