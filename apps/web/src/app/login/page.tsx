"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Login() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg("");
    const f = new FormData(e.currentTarget); const db = supabaseBrowser();
    const { data, error } = await db.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error || !data.user) return setMsg("Check your email and password, then try again.");
    const { data: roles } = await db.from("user_roles").select("role").eq("user_id", data.user.id);
    const staff = (roles ?? []).some((r) => r.role !== "student");
    const next = new URLSearchParams(location.search).get("next");
    window.location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : staff ? "/staff" : "/hostels";
  }
  return (<main style={{ maxWidth: "26rem" }}><h1>Sign in</h1><p>Students and staff use the same sign-in.</p>
    <form onSubmit={submit}>
      <label>Email<input className="field" name="email" type="email" required /></label>
      <label>Password<input className="field" name="password" type="password" required /></label>
      <button className="btn" type="submit">Sign in</button>
      {msg && <p className="err" role="alert">{msg}</p>}
    </form><p><a href="/forgot-password">Forgot your password?</a></p><p>New student? <a href="/register">Create your account</a></p></main>);
}
