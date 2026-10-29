"use client";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function MarkRead() {
  async function go() { await supabaseBrowser().from("notifications").update({ read_at: new Date().toISOString() }).is("read_at", null); location.reload(); }
  return <button className="btn-outline" onClick={go}>Mark all as read</button>;
}
