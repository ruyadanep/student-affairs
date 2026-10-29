import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { required } = await req.json();
  if (required) { // never let an admin lock themselves out
    const { data: aal } = await db.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== "aal2") return NextResponse.json({ error: "Set up and verify your own two-step verification first." }, { status: 400 });
  }
  const { data, error } = await db.from("app_settings").update({ value: required ? "true" : "false", updated_at: new Date().toISOString() }).eq("key", "require_staff_mfa").select("key").maybeSingle();
  if (error || !data) return NextResponse.json({ error: "Only a super admin can change this." }, { status: 403 });
  await db.rpc("log_event", { p_action: required ? "mfa_required" : "mfa_optional", p_entity: "app_settings", p_meta: {} });
  return NextResponse.json({ ok: true });
}
