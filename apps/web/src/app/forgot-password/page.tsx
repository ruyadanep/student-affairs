"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Forgot() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const email = String(new FormData(e.currentTarget).get("email")).trim();
    await supabaseBrowser().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/reset-password` });
    setMsg("If that email has an account, a reset link is on its way. Check your inbox and spam folder.");
  }
  return (<main style={{ maxWidth: "26rem" }}><h1>Reset your password</h1>
    <form onSubmit={submit}><label>Email<input className="field" name="email" type="email" required /></label><button className="btn" type="submit">Send reset link</button>{msg && <p className="ok" role="status">{msg}</p>}</form></main>);
}
