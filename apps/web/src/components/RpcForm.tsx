"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type Field = { name: string; label: string; type?: "text" | "number" | "textarea" | "select" | "date" | "datetime-local" | "checkbox"; options?: [string, string][]; required?: boolean; placeholder?: string; defaultValue?: string };

/** Generic staff form: posts p_* args to /api/staff/rpc and shows the result. */
export default function RpcForm({ fn, fields, button, confirmText, onDone, hidden }: {
  fn: string; fields: Field[]; button: string; confirmText?: string; onDone?: "refresh" | "none"; hidden?: Record<string, unknown>;
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (confirmText && !window.confirm(confirmText)) return;
    const f = new FormData(e.currentTarget);
    const args: Record<string, unknown> = { ...(hidden ?? {}) };
    for (const fd of fields) {
      if (fd.type === "checkbox") { args[fd.name] = f.get(fd.name) === "on"; continue; }
      const v = String(f.get(fd.name) ?? "").trim();
      args[fd.name] = fd.type === "number" ? (v === "" ? null : Number(v)) : v === "" ? null : v;
    }
    setBusy(true); setMsg(null);
    const res = await fetch("/api/staff/rpc", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fn, args }) });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg({ ok: false, text: j.error ?? "That didn't work." }); return; }
    setMsg({ ok: true, text: j.data && typeof j.data === "object" ? JSON.stringify(j.data) : j.data != null ? String(j.data) : "Done." });
    (e.target as HTMLFormElement).reset();
    if (onDone !== "none") router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {fields.map((f) => (
        <label key={f.name} className={f.type === "checkbox" ? "flex items-center gap-2 text-sm" : "block text-sm"}>
          {f.type === "checkbox" ? <input type="checkbox" name={f.name} /> : <span className="mb-1 block font-medium">{f.label}</span>}
          {f.type === "textarea" ? <textarea name={f.name} required={f.required} rows={4} placeholder={f.placeholder} defaultValue={f.defaultValue} className="w-full rounded border px-3 py-2" />
            : f.type === "select" ? (
              <select name={f.name} required={f.required} defaultValue={f.defaultValue} className="w-full rounded border px-3 py-2">
                {(f.options ?? []).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ) : f.type === "checkbox" ? <span>{f.label}</span>
            : <input name={f.name} type={f.type ?? "text"} required={f.required} placeholder={f.placeholder} defaultValue={f.defaultValue} className="w-full rounded border px-3 py-2" />}
        </label>
      ))}
      <button disabled={busy} className="btn">{busy ? "Working…" : button}</button>
      {msg && <p role="status" className={`text-sm ${msg.ok ? "text-green-800" : "text-red-700"}`}>{msg.text}</p>}
    </form>
  );
}
