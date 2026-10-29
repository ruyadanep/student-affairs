import { supabaseServer } from "@/lib/supabase/server";
export default async function Verify({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const db = await supabaseServer();
  const { data } = await db.rpc("verify_document", { code });
  const doc = data?.[0];
  return (<main><h1>Document check</h1>
    {doc?.valid ? (<p>This {doc.doc_type === "clearance" ? "clearance certificate" : doc.doc_type.replace("_", " ")} was issued to <strong>{doc.student_name}</strong> on {new Date(doc.issued_at).toDateString()} and is valid.</p>)
      : (<p>No valid document matches this code. Check the code on the printed copy, or contact the Student Affairs office.</p>)}</main>);
}
