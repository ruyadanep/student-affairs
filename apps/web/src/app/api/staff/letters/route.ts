import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { makeLetterPdf } from "@/lib/letter";
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return fail("Sign in first.", 401);
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id).in("role", ["dean_office", "welfare_officer", "super_admin"]);
  if (!roles?.length) return fail("You can't issue letters.", 403);
  const { id, action } = await req.json();
  const { data: r } = await db.from("document_requests").select("*, profiles(full_name,matric_no,department,faculty)").eq("id", id).single();
  if (!r || r.status !== "submitted") return fail("This request has already been handled.");
  if (action === "reject") {
    await db.from("document_requests").update({ status: "rejected", decided_by: user.id }).eq("id", id);
    await db.from("notifications").insert({ user_id: r.student_id, title: "Letter request not approved", body: "Contact the Student Affairs office for details." });
    return NextResponse.json({ ok: true });
  }
  const code = randomBytes(6).toString("base64url").toUpperCase(); const issuedAt = new Date(); const p: any = r.profiles;
  const pdf = await makeLetterPdf({ docType: r.doc_type, studentName: p.full_name, matricNo: p.matric_no, department: p.department, faculty: p.faculty, purpose: r.purpose, addressee: r.addressee, code, siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000", issuedAt });
  const path = `${r.student_id}/${id}.pdf`;
  const up = await supabaseAdmin().storage.from("documents").upload(path, pdf, { contentType: "application/pdf", upsert: true });
  if (up.error) return fail("The letter couldn't be saved. Try again.", 500);
  const { error } = await db.from("document_requests").update({ status: "approved", verification_code: code, pdf_path: path, decided_by: user.id, issued_at: issuedAt.toISOString() }).eq("id", id);
  if (error) return fail("The letter couldn't be issued. Try again.", 500);
  await db.from("notifications").insert({ user_id: r.student_id, title: "Your letter is ready", body: "Open Letters to download it." });
  return NextResponse.json({ ok: true, code });
}
