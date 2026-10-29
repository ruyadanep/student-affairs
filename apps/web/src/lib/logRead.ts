import type { SupabaseClient } from "@supabase/supabase-js";
/** Record that a staff member opened a sensitive record (welfare, discipline). Never throws. */
export async function logRead(db: SupabaseClient, entity: string, id: string) {
  try { await db.rpc("log_event", { p_action: "read_record", p_entity: entity, p_meta: { id } }); } catch { /* logging must not break the page */ }
}
