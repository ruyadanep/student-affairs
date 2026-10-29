import { supabaseServer } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";
const day = (d?: string | null) => (d ? new Date(d).toISOString().slice(0, 10) : "");
export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get("type") ?? "";
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return new Response("Sign in first.", { status: 401 });
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", user.id);
  const mine = (roles ?? []).map((r) => r.role as string);
  const dean = mine.includes("dean_office") || mine.includes("super_admin");
  if (!(dean || mine.includes("hostel_officer"))) return new Response("Not allowed.", { status: 403 });
  let rows: (string | number | boolean | null | undefined)[][] = [];
  if (type === "occupancy") {
    const { data } = await db.rpc("report_overview");
    rows = [["Hostel", "Gender", "Beds", "Occupied", "Vacant"], ...(data?.occupancy ?? []).map((h: any) => [h.name, h.gender, h.beds, h.occupied, h.beds - h.occupied])];
  } else if (type === "hostel_applications") {
    const { data } = await db.from("hostel_applications").select("status,created_at,profiles(full_name,matric_no,gender,faculty,department,level),payment_records(reference,status),hostel_sessions(academic_session)").limit(10000);
    rows = [["Session", "Matric no", "Name", "Gender", "Faculty", "Department", "Level", "Payment reference", "Payment status", "Application status", "Applied on"],
      ...(data ?? []).map((a: any) => [a.hostel_sessions?.academic_session, a.profiles?.matric_no, a.profiles?.full_name, a.profiles?.gender, a.profiles?.faculty, a.profiles?.department, a.profiles?.level, a.payment_records?.reference, a.payment_records?.status, a.status, day(a.created_at)])];
  } else if (type === "clearance") {
    const { data } = await db.from("clearance_requests").select("status,academic_session,created_at,cleared_at,profiles(full_name,matric_no,faculty,department)").limit(10000);
    rows = [["Session", "Matric no", "Name", "Faculty", "Department", "Status", "Started", "Cleared"], ...(data ?? []).map((c: any) => [c.academic_session, c.profiles?.matric_no, c.profiles?.full_name, c.profiles?.faculty, c.profiles?.department, c.status, day(c.created_at), day(c.cleared_at)])];
  } else if (type === "maintenance") {
    const { data } = await db.from("maintenance_tickets").select("category,status,created_at,resolved_at,hostels(name),rooms(block,room_no)").limit(10000);
    rows = [["Hostel", "Block", "Room", "Category", "Status", "Reported", "Fixed"], ...(data ?? []).map((t: any) => [t.hostels?.name, t.rooms?.block, t.rooms?.room_no, t.category, t.status, day(t.created_at), day(t.resolved_at)])];
  } else if (type === "students" && dean) {
    const { data } = await db.from("enrolled_students").select("*").limit(20000);
    rows = [["Matric no", "Name", "Gender", "Faculty", "Department", "Level", "Fresh", "Final year", "Has account"], ...(data ?? []).map((s: any) => [s.matric_no, s.full_name, s.gender, s.faculty, s.department, s.level, s.is_fresh ? "yes" : "no", s.is_final_year ? "yes" : "no", s.claimed_by ? "yes" : "no"])];
  } else return new Response("Unknown report.", { status: 400 });
  await db.rpc("log_event", { p_action: "export", p_entity: "report", p_meta: { type, rows: rows.length - 1 } });
  return new Response(toCsv(rows), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${type}-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
}
