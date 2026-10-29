import { supabaseServer } from "@/lib/supabase/server";
import { makeCertificatePdf } from "@/lib/certificate";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await supabaseServer();
  const { data: r } = await db.from("clearance_requests").select("status,academic_session,verification_code,cleared_at,profiles(full_name,matric_no,department,faculty),clearance_steps(acted_at,clearance_units(name,sequence))").eq("id", id).maybeSingle(); // row-level security: the student or clearance staff only
  if (!r || r.status !== "cleared" || !r.verification_code) return new Response("Not found", { status: 404 });
  const p: any = r.profiles;
  const units = ((r as any).clearance_steps ?? []).sort((a: any, b: any) => a.clearance_units.sequence - b.clearance_units.sequence).map((s: any) => ({ name: s.clearance_units.name, approvedAt: s.acted_at ? new Date(s.acted_at) : null }));
  const pdf = await makeCertificatePdf({ studentName: p.full_name, matricNo: p.matric_no, department: p.department, faculty: p.faculty, session: r.academic_session, units, code: r.verification_code, siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000", clearedAt: new Date(r.cleared_at ?? Date.now()) });
  return new Response(pdf as any, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="clearance-certificate.pdf"` } });
}
