import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { category, description } = await req.json();
  if (!category || !String(description ?? "").trim()) return NextResponse.json({ error: "Choose a category and describe the problem." }, { status: 400 });
  // Attach the student's current room automatically so officers know where to go
  const { data: a } = await db.from("allocations").select("bed_spaces(rooms(id,hostel_id))").eq("status", "active").limit(1).maybeSingle();
  const room: any = (a as any)?.bed_spaces?.rooms;
  const { error } = await db.from("maintenance_tickets").insert({ reporter_id: user.id, category, description: String(description).trim(), room_id: room?.id ?? null, hostel_id: room?.hostel_id ?? null });
  if (error) return NextResponse.json({ error: "Your report couldn't be saved. Try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
