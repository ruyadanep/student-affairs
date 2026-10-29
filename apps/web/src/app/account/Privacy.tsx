"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Privacy() {
  const [m, setM] = useState(""); const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().from("data_requests").insert({ kind: String(f.get("kind")), details: String(f.get("details")).trim() });
    if (error) { setM("Couldn't send. Please try again."); return; }
    setM("Sent. The Dean's office will reply in your notifications."); (e.target as HTMLFormElement).reset(); router.refresh();
  }
  return (
    <form onSubmit={submit} className="space-y-3 text-sm">
      <select name="kind" className="w-full rounded border px-3 py-2"><option value="correction">Correct my information</option><option value="deletion">Delete my personal data</option></select>
      <textarea name="details" required minLength={10} rows={3} placeholder="Tell us what to change or remove" className="w-full rounded border px-3 py-2" />
      <button className="btn">Send request</button>
      {m && <p role="status">{m}</p>}
    </form>
  );
}
