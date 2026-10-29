"use client";
import { useState } from "react";
type Opt = [string, string];
function Group({ title, options, value, onChange }: { title: string; options: Opt[]; value: string[]; onChange: (v: string[]) => void }) {
  return (<fieldset style={{ border: "1px solid var(--line)", borderRadius: ".4rem", margin: "0 0 .9rem" }}><legend>{title}</legend>
    {!options.length && <small>None available yet.</small>}
    {options.map(([v, t]) => (<label key={v} style={{ display: "inline-block", marginRight: "1rem" }}><input type="checkbox" checked={value.includes(v)} onChange={(e) => onChange(e.target.checked ? [...value, v] : value.filter((x) => x !== v))} /> {t}</label>))}</fieldset>);
}
export default function Compose({ hostels, faculties }: { hostels: Opt[]; faculties: string[] }) {
  const [title, setTitle] = useState(""), [body, setBody] = useState("");
  const [hs, setHs] = useState<string[]>([]), [lv, setLv] = useState<string[]>([]), [fa, setFa] = useState<string[]>([]);
  const [msg, setMsg] = useState(""), [ok, setOk] = useState(false);
  const post = (extra: object) => fetch("/api/staff/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, body, hostel_ids: hs, levels: lv, faculties: fa, ...extra }) });
  async function preview() { const r = await post({ action: "count" }); const j = await r.json(); setOk(r.ok); setMsg(r.ok ? `${j.count} students will receive this.` : j.error); }
  async function send() {
    const c = await (await post({ action: "count" })).json();
    if (!c.count) { setOk(false); return setMsg("No students match this audience."); }
    if (!confirm(`Send this to ${c.count} students?`)) return;
    const r = await post({ action: "send" }); const j = await r.json(); setOk(r.ok);
    setMsg(r.ok ? `Sent to ${j.sent} students.` : j.error); if (r.ok) setTimeout(() => location.reload(), 1200);
  }
  return (<div className="card"><h2 style={{ marginTop: 0 }}>New announcement</h2>
    <label>Title<input className="field" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
    <label>Message<textarea className="field" rows={4} value={body} onChange={(e) => setBody(e.target.value)} /></label>
    <p><small>Leave a group empty to include everyone in it. Groups combine, for example Hostel A and 100 level.</small></p>
    <Group title="Hostel residents" options={hostels} value={hs} onChange={setHs} />
    <Group title="Level" options={["100", "200", "300", "400", "500", "600"].map((l) => [l, l] as Opt)} value={lv} onChange={setLv} />
    <Group title="Faculty" options={faculties.map((f) => [f, f] as Opt)} value={fa} onChange={setFa} />
    <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><button className="btn-outline" onClick={preview}>Check recipients</button><button className="btn" onClick={send}>Send announcement</button></div>
    {msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</div>);
}
