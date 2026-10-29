"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SendNow() {
  const [t, setT] = useState(""); const [busy, setBusy] = useState(false); const router = useRouter();
  return (<div><button disabled={busy} onClick={async () => { setBusy(true); const r = await fetch("/api/cron/messages", { method: "POST" }); const j = await r.json().catch(() => ({})); setBusy(false);
    setT(r.ok ? `Sent ${j.sent}, failed ${j.failed}, scheduled announcements released ${j.scheduled_sent}.` : j.error ?? "Failed."); router.refresh(); }}
    className="btn">{busy ? "Sending…" : "Send queued messages now"}</button>
    {t && <p role="status" className="mt-2 text-sm">{t}</p>}</div>);
}
