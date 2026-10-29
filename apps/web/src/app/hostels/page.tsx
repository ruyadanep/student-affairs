import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ApplyForm from "./ApplyForm";
import RoomChange from "./RoomChange";
const label: Record<string, string> = { draft: "Draft", submitted: "Waiting for payment check", eligible: "Payment confirmed, awaiting allocation", allocated: "Room allocated", waitlisted: "On the waiting list", rejected: "Not successful" };
export const metadata = { title: "Hostel accommodation" };
export default async function Hostels() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: session } = await db.from("hostel_sessions").select("*").eq("is_current", true).maybeSingle();
  const { data: hostels } = await db.from("hostels").select("id,name,gender").eq("active", true).order("name");
  const { data: app } = session ? await db.from("hostel_applications").select("status,reason,payment_records(status,reference)").eq("student_id", user.id).eq("session_id", session.id).maybeSingle() : { data: null };
  const { data: alloc } = await db.from("allocations").select("id,checked_in_at,bed_spaces(label,rooms(block,room_no,hostels(name)))").eq("status", "active").limit(1).maybeSingle();
  const { data: rc } = alloc ? await db.from("room_change_requests").select("status,decision_note").eq("allocation_id", alloc.id).order("created_at", { ascending: false }).limit(1).maybeSingle() : { data: null };
  const bed: any = alloc?.bed_spaces; const room = bed?.rooms;
  return (<main><h1>Hostel accommodation</h1>
    {!session && <p>No hostel session is open yet. Check back soon.</p>}
    {session && <p>Session <strong>{session.academic_session}</strong></p>}
    {alloc && (<div className="card"><span className="badge">Room allocated</span>
      <h2>{room?.hostels?.name}</h2><p>Block {room?.block ?? "-"}, room {room?.room_no}, bed {bed?.label}. {alloc.checked_in_at ? ` Checked in on ${new Date(alloc.checked_in_at).toDateString()}.` : " Check in with your ID card and receipt."}</p><RoomChange allocationId={alloc.id} status={rc?.status} note={rc?.decision_note} /></div>)}
    {!alloc && app && (<div className="card"><span className="badge gold">{label[app.status] ?? app.status}</span>
      {app.reason && <p>{app.reason}</p>}<p>Payment reference: {(app as any).payment_records?.reference ?? "not entered"}</p></div>)}
    {session && !alloc && (!app || app.status === "draft") && (<div className="card"><h2>Apply for a room</h2>
      <p>Pay on plasu.edu.ng first, then enter the reference from your receipt.</p>
      <ApplyForm hostels={hostels ?? []} needsPayment /></div>)}
  </main>);
}
