import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { matric } = await req.json().catch(() => ({}));
  const { data: uid, error } = await db.rpc("anonymise_student", { p_matric: String(matric ?? "") });   // checks super_admin itself
  if (error || !uid) return NextResponse.json({ error: error?.message ?? "Failed." }, { status: 400 });
  // Scrub the login too: replace the email and disable sign-in for good.
  const { error: e2 } = await supabaseAdmin().auth.admin.updateUserById(uid as string, { email: `anon-${uid}@invalid.local`, ban_duration: "876000h", user_metadata: {} });
  if (e2) return NextResponse.json({ error: "Profile anonymised, but the login could not be disabled: " + e2.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
