import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import StartButton from "./StartButton";
import Resubmit from "./Resubmit";
export const metadata = { title: "Clearance" };
export default async function Clearance() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: req } = await db.from("clearance_requests").select("id,status,academic_session,clearance_steps(id,status,reason,clearance_units(name,sequence))").eq("student_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const steps = ((req as any)?.clearance_steps ?? []).sort((a: any, b: any) => a.clearance_units.sequence - b.clearance_units.sequence);
  const done = steps.filter((s: any) => s.status === "approved").length;
  return (<main><h1>Clearance</h1>
    {!req && (<div className="card"><p>Start clearance when you're ready. Each unit approves in order.</p><StartButton /></div>)}
    {req && (<>
      <p>{req.status === "cleared" ? <span className="badge">Cleared</span> : <span className="badge gold">{done} of {steps.length} units approved</span>} <small>Session {req.academic_session}</small></p>
      {req.status === "cleared" && <p><a className="btn" href={`/api/clearance/${req.id}/certificate`} target="_blank">Download clearance certificate</a></p>}
      <ol style={{ paddingLeft: "1.2rem" }}>{steps.map((s: any) => (<li key={s.id} style={{ marginBottom: ".7rem" }}>
        <strong>{s.clearance_units.name}</strong> <span className={s.status === "approved" ? "badge" : "badge gold"}>{s.status}</span>
        {s.status === "returned" && (<><div className="err">Returned{s.reason ? `: ${s.reason}` : ""}</div><Resubmit step={s.id} /></>)}</li>))}</ol>
    </>)}
  </main>);
}
