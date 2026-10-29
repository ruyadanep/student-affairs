"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
const reasons: Record<string, string> = {
  unknown: "We couldn't find that matric number. Check it, or contact the Student Affairs office.",
  claimed: "That matric number already has an account. Try signing in instead.",
  email_mismatch: "Use the email address the university has on record for you.",
};
export default function Register() {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(""); const f = new FormData(e.currentTarget);
    const matric = String(f.get("matric")).trim().toUpperCase(), email = String(f.get("email")).trim(), password = String(f.get("password"));
    if (password.length < 8) { setOk(false); return setMsg("Use a password of at least 8 characters."); }
    const db = supabaseBrowser();
    const { data: check } = await db.rpc("check_registration", { p_matric: matric, p_email: email });
    if (check !== "ok") { setOk(false); return setMsg(reasons[check as string] ?? "Registration isn't available right now."); }
    const { data, error } = await db.auth.signUp({ email, password, options: { data: { matric_no: matric }, emailRedirectTo: `${location.origin}/auth/callback?next=/hostels` } });
    if (error) { setOk(false); return setMsg("We couldn't create your account. Try a different email or password."); }
    setOk(true);
    if (data.session) window.location.href = "/hostels"; else setMsg("Check your email and click the link to confirm your account, then sign in.");
  }
  return (<main style={{ maxWidth: "26rem" }}><h1>Create your account</h1>
    <form onSubmit={submit}>
      <label>Matric number<input className="field" name="matric" placeholder="PLASU/21/CSC/0042" required /></label>
      <label>Email<input className="field" name="email" type="email" required /></label>
      <label>Password<input className="field" name="password" type="password" minLength={8} required /></label>
      <button className="btn" type="submit">Create account</button>
      {msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}
    </form><p>Already have an account? <a href="/login">Sign in</a></p></main>);
}
