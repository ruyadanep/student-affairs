"use client";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Handled({ id }: { id: string }) {
  async function go() { await supabaseBrowser().from("contact_messages").update({ handled: true }).eq("id", id); location.reload(); }
  return <button className="btn-outline" onClick={go}>Mark handled</button>;
}
