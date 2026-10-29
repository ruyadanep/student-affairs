import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
const clean = (v: unknown, max: number) => { const s = String(v ?? "").trim().slice(0, max); return s || null; };
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return fail("Sign in first.", 401);
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id);
  const admin = (roles ?? []).some((r) => r.role === "dean_office" || r.role === "super_admin");
  const b = await req.json();

  if (b.action === "create" || (b.action === "update" && admin)) {
    if (!admin) return fail("Only the Dean's office can do that.", 403);
    if (!String(b.full_name ?? "").trim()) return fail("Enter the person's name.");
    let user_id: string | null | undefined;
    if (String(b.account_email ?? "").trim()) {
      const { data: p } = await db.from("profiles").select("id").ilike("email", String(b.account_email).trim()).maybeSingle();
      if (!p) return fail("No account has that email. Leave it empty to add them without an account.");
      user_id = p.id;
    } else if (b.action === "create") user_id = null;
    const row: Record<string, unknown> = { full_name: clean(b.full_name, 120), title: clean(b.title, 120), unit: clean(b.unit, 120), bio: clean(b.bio, 2500), email: clean(b.email, 200), phone: clean(b.phone, 40), sort_order: Number.isFinite(Number(b.sort_order)) ? Number(b.sort_order) : 100, published: !!b.published, updated_at: new Date().toISOString() };
    if (user_id !== undefined) row.user_id = user_id;
    const q = b.action === "create" ? db.from("staff_members").insert(row) : db.from("staff_members").update(row).eq("id", b.id);
    const { error } = await q;
    return error ? fail("That couldn't be saved. The account may already be linked to another profile.", 409) : NextResponse.json({ ok: true });
  }
  if (b.action === "update") { // a staff member editing their own bio
    const { data, error } = await db.from("staff_members").update({ bio: clean(b.bio, 2500), updated_at: new Date().toISOString() }).eq("id", b.id).eq("user_id", user.id).select("id").maybeSingle();
    return error || !data ? fail("You can only edit your own profile.", 403) : NextResponse.json({ ok: true });
  }
  if (b.action === "delete") {
    if (!admin) return fail("Only the Dean's office can delete profiles.", 403);
    const { data } = await db.from("staff_members").select("photo_path").eq("id", b.id).maybeSingle();
    const { error } = await db.from("staff_members").delete().eq("id", b.id);
    if (error) return fail("That couldn't be deleted.", 500);
    if (data?.photo_path) await supabaseAdmin().storage.from("staff-photos").remove([data.photo_path]);
    return NextResponse.json({ ok: true });
  }
  return fail("Unknown action.");
}
