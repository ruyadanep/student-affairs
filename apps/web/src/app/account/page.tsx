import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Prefs from "./Prefs";
import Privacy from "./Privacy";

export const metadata = { title: "My account" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/account");
  const { data: p } = await db.from("profiles").select("full_name,matric_no,email,phone,email_alerts,sms_alerts").eq("id", user.id).maybeSingle();
  const { data: reqs } = await db.from("data_requests").select("id,kind,status,decision_note,created_at").eq("student_id", user.id).order("created_at", { ascending: false });
  const { data: logins } = await db.from("login_events").select("id,created_at,ip").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div><h1 className="text-2xl font-bold">My account</h1><p className="text-sm text-gray-700">{p?.full_name} · {p?.matric_no} · {p?.email ?? user.email}</p></div>
      <section><h2 className="mb-2 font-semibold">Alerts</h2><Prefs email={p?.email_alerts ?? true} sms={p?.sms_alerts ?? false} phone={p?.phone ?? ""} /></section>
      <section><h2 className="mb-2 font-semibold">Recent sign-ins</h2>
        <ul className="text-sm">{(logins ?? []).map((l: { id: number; created_at: string; ip: string | null }) => <li key={l.id}>{new Date(l.created_at).toLocaleString("en-NG")} · {l.ip ?? "unknown"}</li>)}</ul>
        <p className="mt-1 text-xs text-gray-600">Don't recognise one? Change your password and tell the Dean's office.</p></section>
      <section><h2 className="mb-2 font-semibold">Your data</h2>
        <p className="mb-3 text-sm">Under the Nigeria Data Protection Act you can get a copy of your data, ask for corrections, or ask for deletion. Records the University must keep by law may be retained.</p>
        <a href="/api/account/export" className="inline-block rounded border px-4 py-2 text-sm font-semibold">Download my data (JSON)</a>
        <div className="mt-4"><Privacy /></div>
        <ul className="mt-3 text-sm">{(reqs ?? []).map((r: { id: string; kind: string; status: string; decision_note: string | null }) => <li key={r.id}>{r.kind}: {r.status}{r.decision_note ? ` · ${r.decision_note}` : ""}</li>)}</ul></section>
    </main>
  );
}
