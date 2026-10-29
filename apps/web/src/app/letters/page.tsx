import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import RequestForm from "./RequestForm";
const names: Record<string, string> = { good_standing: "Letter of good standing", character_reference: "Character reference", attestation: "Attestation letter", other: "Letter" };
export const metadata = { title: "Letters and attestations" };
export default async function Letters() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: docs } = await db.from("document_requests").select("id,doc_type,purpose,status,created_at").eq("student_id", user.id).order("created_at", { ascending: false });
  return (<main><h1>Letters and attestations</h1>
    <div className="card"><h2>Request a letter</h2><RequestForm /></div>
    <h2>Your requests</h2>
    {!docs?.length && <p>You haven't requested a letter yet.</p>}
    {(docs ?? []).map((d) => (<div className="card" key={d.id}><strong>{names[d.doc_type]}</strong> <span className={d.status === "approved" ? "badge" : "badge gold"}>{d.status === "submitted" ? "Waiting for approval" : d.status}</span>
      <p>{d.purpose}</p>{d.status === "approved" && <a className="btn" href={`/api/letters/${d.id}/pdf`} target="_blank">Download PDF</a>}</div>))}
  </main>);
}
