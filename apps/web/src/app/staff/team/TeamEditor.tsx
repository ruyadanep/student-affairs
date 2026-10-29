"use client";
import { useState } from "react";
export type M = { id?: string; full_name: string; title: string | null; unit: string | null; bio: string | null; email: string | null; phone: string | null; sort_order: number; published: boolean; photo_url: string | null; account_email: string | null };
async function send(body: object) { const r = await fetch("/api/staff/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); return { ok: r.ok, j: await r.json() }; }
export default function TeamEditor({ m, admin, isNew }: { m: M; admin: boolean; isNew?: boolean }) {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  const done = (r: { ok: boolean; j: any }, text: string) => { setOk(r.ok); setMsg(r.ok ? text : r.j.error); if (r.ok) setTimeout(() => location.reload(), 700); };
  async function save(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)); done(await send({ action: isNew ? "create" : "update", id: m.id, ...f, published: f.published === "on" }), "Saved."); }
  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget); fd.set("id", m.id!); setMsg("Uploading…");
    const r = await fetch("/api/staff/team/photo", { method: "POST", body: fd }); done({ ok: r.ok, j: await r.json() }, "Photo updated.");
  }
  async function remove() { if (confirm(`Delete ${m.full_name}'s profile?`)) done(await send({ action: "delete", id: m.id }), "Deleted."); }
  const ro = !admin;
  return (<div className="card">
    <h3 style={{ marginTop: 0 }}>{isNew ? "Add a team member" : m.full_name} {!isNew && (m.published ? <span className="badge">Published</span> : <span className="badge grey">Hidden</span>)}</h3>
    {!isNew && (<form onSubmit={upload} style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {m.photo_url ? <img src={m.photo_url} alt="" width={72} height={72} style={{ borderRadius: "50%", objectFit: "cover" }} /> : <div aria-hidden style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--line)" }} />}
      <label style={{ margin: 0 }}>Photo (JPG, PNG, or WebP)<input className="field" style={{ margin: ".2rem 0 0" }} type="file" name="file" accept="image/jpeg,image/png,image/webp" required /></label>
      <button className="btn-outline" type="submit">Upload photo</button></form>)}
    <form onSubmit={save}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(14rem,1fr))", gap: "0 1rem" }}>
        <label>Full name<input className="field" name="full_name" defaultValue={m.full_name} disabled={ro} required /></label>
        <label>Title<input className="field" name="title" defaultValue={m.title ?? ""} disabled={ro} placeholder="Dean of Student Affairs" /></label>
        <label>Unit<input className="field" name="unit" defaultValue={m.unit ?? ""} disabled={ro} placeholder="Hostel office" /></label>
        {admin && <label>Account email (links their sign-in)<input className="field" name="account_email" defaultValue={m.account_email ?? ""} type="email" /></label>}
        <label>Public email (optional)<input className="field" name="email" defaultValue={m.email ?? ""} disabled={ro} type="email" /></label>
        <label>Public phone (optional)<input className="field" name="phone" defaultValue={m.phone ?? ""} disabled={ro} /></label>
        {admin && <label>Display order (1 shows first)<input className="field" name="sort_order" type="number" defaultValue={m.sort_order} /></label>}</div>
      <label>Bio<textarea className="field" name="bio" rows={5} maxLength={2500} defaultValue={m.bio ?? ""} /></label>
      {admin && <label style={{ marginBottom: "1rem" }}><input type="checkbox" name="published" defaultChecked={m.published} /> Show on the public team page</label>}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><button className="btn" type="submit">{isNew ? "Add member" : "Save"}</button>{!isNew && admin && <button type="button" className="btn-outline" onClick={remove}>Delete</button>}</div>
      {msg && <p className={ok ? "ok" : "err"} role="status">{msg}</p>}</form></div>);
}
