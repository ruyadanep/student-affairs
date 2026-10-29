"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export function Rsvp({ eventId, going }: { eventId: string; going: boolean }) {
  const [on, setOn] = useState(going); const [busy, setBusy] = useState(false); const router = useRouter();
  async function toggle() {
    setBusy(true); const db = supabaseBrowser();
    const { error } = on ? await db.from("event_rsvps").delete().eq("event_id", eventId) : await db.from("event_rsvps").insert({ event_id: eventId });
    setBusy(false); if (!error) { setOn(!on); router.refresh(); }
  }
  return <button onClick={toggle} disabled={busy} className={`rounded px-3 py-1.5 text-sm font-semibold ${on ? "border" : "bg-[#0b5c36] text-white"}`}>{on ? "Cancel RSVP" : "I'm going"}</button>;
}

export function RequestEvent({ orgs }: { orgs: { id: string; name: string }[] }) {
  const [m, setM] = useState<{ ok: boolean; t: string } | null>(null); const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().from("events").insert({
      title: String(f.get("title")).trim(), venue: String(f.get("venue")).trim(), description: String(f.get("description") || "") || null,
      organisation_id: String(f.get("org") || "") || null, starts_at: new Date(String(f.get("starts"))).toISOString(), capacity: f.get("capacity") ? Number(f.get("capacity")) : null,
    });
    if (error) { setM({ ok: false, t: "Couldn't send the request. Check the details." }); return; }
    setM({ ok: true, t: "Sent for approval. You'll get a notification." }); (e.target as HTMLFormElement).reset(); router.refresh();
  }
  return (
    <form onSubmit={submit} className="grid gap-3 text-sm">
      <input name="title" required placeholder="Event title" className="rounded border px-3 py-2" />
      <input name="venue" required placeholder="Venue" className="rounded border px-3 py-2" />
      <input name="starts" type="datetime-local" required className="rounded border px-3 py-2" />
      <input name="capacity" type="number" min="1" placeholder="Capacity (optional)" className="rounded border px-3 py-2" />
      {orgs.length > 0 && <select name="org" className="rounded border px-3 py-2"><option value="">Not for an organisation</option>{orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>}
      <textarea name="description" rows={3} placeholder="What is it about?" className="rounded border px-3 py-2" />
      <button className="w-fit rounded bg-[#0b5c36] px-4 py-2 font-semibold text-white">Request approval</button>
      {m && <p role="status" className={m.ok ? "text-green-800" : "text-red-700"}>{m.t}</p>}
    </form>
  );
}
