import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const b = await req.json();
  if (b.website) return NextResponse.json({ ok: true }); // hidden field filled in: treat as a bot, pretend success
  const name = String(b.name ?? "").trim(), email = String(b.email ?? "").trim(), message = String(b.message ?? "").trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) return NextResponse.json({ error: "Enter your name, a valid email, and a message." }, { status: 400 });
  if (message.length > 3000) return NextResponse.json({ error: "Please keep your message under 3000 characters." }, { status: 400 });
  const db = await supabaseServer();
  const { error } = await db.from("contact_messages").insert({ name, email, topic: String(b.topic ?? "").slice(0, 80) || null, message });
  if (error) return NextResponse.json({ error: "Your message couldn't be sent. Try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
