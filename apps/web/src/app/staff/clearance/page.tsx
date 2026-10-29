import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Actions from "./Actions";
export const metadata = { title: "Clearance queue" };
export default async function StaffClearance() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: mine } = await db.from("unit_officers").select("unit_id").eq("user_id", user.id);
  const unitIds = (mine ?? []).map((m) => m.unit_id);
  if (!unitIds.length) return <main><h1>Clearance queue</h1><p>You aren't assigned to a clearance unit yet. Ask the Dean's office.</p></main>;
  const { data: steps } = await db.from("clearance_steps").select("id,status,reason,clearance_units(name,sequence),clearance_requests(profiles(full_name,matric_no),clearance_steps(status,clearance_units(sequence)))").in("unit_id", unitIds).in("status", ["pending", "returned"]);
  return (<main><h1>Clearance queue</h1>
    <div className="table-scroll"><table><thead><tr><th>Student</th><th>Unit</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {(steps ?? []).map((s: any) => {
        const mineSeq = s.clearance_units.sequence;
        const blocked = (s.clearance_requests?.clearance_steps ?? []).some((x: any) => x.clearance_units.sequence < mineSeq && x.status !== "approved");
        return (<tr key={s.id}><td>{s.clearance_requests?.profiles?.full_name}<br /><small>{s.clearance_requests?.profiles?.matric_no}</small></td>
          <td>{s.clearance_units.name}</td><td><span className="badge gold">{blocked ? "waiting on earlier units" : s.status}</span>{s.reason && <div><small>{s.reason}</small></div>}</td>
          <td><Actions step={s.id} blocked={blocked} /></td></tr>);
      })}
      {!steps?.length && <tr><td colSpan={4}>Nothing waiting for your unit.</td></tr>}
    </tbody></table></div></main>);
}
