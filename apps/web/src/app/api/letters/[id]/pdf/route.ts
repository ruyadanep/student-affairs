import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await supabaseServer();
  const { data: r } = await db.from("document_requests").select("pdf_path,status").eq("id", id).maybeSingle(); // row-level security: owner or staff only
  if (!r || r.status !== "approved" || !r.pdf_path) return new Response("Not found", { status: 404 });
  const { data, error } = await supabaseAdmin().storage.from("documents").download(r.pdf_path);
  if (error || !data) return new Response("Not found", { status: 404 });
  return new Response(await data.arrayBuffer(), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="letter-${id.slice(0, 8)}.pdf"` } });
}
