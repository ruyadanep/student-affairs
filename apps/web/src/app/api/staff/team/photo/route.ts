import { NextResponse } from "next/server";
import sharp from "sharp";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
export const runtime = "nodejs";
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return fail("Sign in first.", 401);
  const fd = await req.formData(); const id = String(fd.get("id") ?? ""); const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Choose a photo first.");
  if (file.size > 5 * 1024 * 1024) return fail("Choose a photo under 5 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return fail("Use a JPG, PNG, or WebP photo.");
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id);
  const admin = (roles ?? []).some((r) => r.role === "dean_office" || r.role === "super_admin");
  const { data: m } = await db.from("staff_members").select("id,user_id").eq("id", id).maybeSingle();
  if (!m || (!admin && m.user_id !== user.id)) return fail("You can only change your own photo.", 403);
  let out: Buffer;
  try { out = await sharp(Buffer.from(await file.arrayBuffer())).rotate().resize(480, 480, { fit: "cover", position: "attention" }).webp({ quality: 82 }).toBuffer(); } // square crop, correct orientation, location data removed
  catch { return fail("That file couldn't be read as a photo."); }
  const path = `${id}.webp`; const sb = supabaseAdmin();
  const up = await sb.storage.from("staff-photos").upload(path, out, { contentType: "image/webp", upsert: true, cacheControl: "3600" });
  if (up.error) return fail("The photo couldn't be saved. Try again.", 500);
  await sb.from("staff_members").update({ photo_path: path, updated_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json({ ok: true });
}
