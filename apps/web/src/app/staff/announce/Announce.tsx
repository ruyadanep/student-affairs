"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type T = { id: string; name: string; title: string; body: string };
export default function Announce({ hostels, templates }: { hostels: { id: string; name: string }[]; templates: T[] }) {
  const [title, setTitle] = useState(""); const [body, setBody] = useState("");
  const [email, setEmail] = useState(false); const [sms, setSms] = useState(false);
  const [when, setWhen] = useState(""); const [tname, setTname] = useState("");
  const [hostel, setHostel] = useState(""); const [level, setLevel] = useState(""); const [faculty, setFaculty] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null); const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function call(fn: string, args: Record<string, unknown>) {
    setBusy(true); setMsg(null);
    const r = await fetch("/api/staff/rpc", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fn, args }) });
    const j = await r.json().catch(() => ({})); setBusy(false);
    if (!r.ok) { setMsg({ ok: false, t: j.error ?? "Failed." }); return false; }
    router.refresh(); return j.data;
  }
  const audience = { p_hostel: hostel || null, p_level: level ? Number(level) : null, p_faculty: faculty || null };
  async function send() {
    if (!window.confirm(when ? "Schedule this announcement?" : "Send this announcement now?")) return;
    const common = { p_title: title, p_body: body, ...audience, p_email: email, p_sms: sms };
    const d = await call(when ? "schedule_announcement" : "send_announcement_v2", when ? { ...common, p_send_at: new Date(when).toISOString() } : common);
    if (d !== false) { setMsg({ ok: true, t: when ? "Scheduled." : `Sent to ${d} students. Email/SMS go out on the next delivery run.` }); if (!when) { setTitle(""); setBody(""); } }
  }
  return (
    <div className="space-y-3 text-sm">
      {templates.length > 0 && (
        <select onChange={(e) => { const t = templates.find((x) => x.id === e.target.value); if (t) { setTitle(t.title); setBody(t.body); } }} className="w-full rounded border px-3 py-2" defaultValue="">
          <option value="">Start from a template…</option>{templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>)}
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded border px-3 py-2" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Message" className="w-full rounded border px-3 py-2" />
      <div className="grid gap-2 sm:grid-cols-3">
        <select value={hostel} onChange={(e) => setHostel(e.target.value)} className="rounded border px-2 py-2"><option value="">All hostels</option>{hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}</select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded border px-2 py-2"><option value="">All levels</option>{[100, 200, 300, 400, 500].map((l) => <option key={l} value={l}>{l} level</option>)}</select>
        <input value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="Faculty (optional)" className="rounded border px-2 py-2" />
      </div>
      <div className="flex flex-wrap gap-4">
        <label><input type="checkbox" checked disabled /> In-app</label>
        <label><input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} /> Email (opted-in students)</label>
        <label><input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} /> SMS (opted-in students)</label>
      </div>
      <label className="block">Send later (leave empty to send now) <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="ml-2 rounded border px-2 py-1" /></label>
      <div className="flex flex-wrap gap-2">
        <button disabled={busy} onClick={send} className="rounded bg-[#0b5c36] px-4 py-2 font-semibold text-white disabled:opacity-60">{when ? "Schedule" : "Send now"}</button>
        <input value={tname} onChange={(e) => setTname(e.target.value)} placeholder="Template name" className="rounded border px-2 py-1" />
        <button disabled={busy || !tname} onClick={async () => { const d = await call("save_template", { p_name: tname, p_title: title, p_body: body }); if (d !== false) setMsg({ ok: true, t: "Template saved." }); }} className="rounded border px-3 py-2">Save as template</button>
      </div>
      {msg && <p role="status" className={msg.ok ? "text-green-800" : "text-red-700"}>{msg.t}</p>}
    </div>
  );
}
