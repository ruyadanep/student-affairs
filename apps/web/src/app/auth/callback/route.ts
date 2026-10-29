import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
// Email links (confirm account, reset password) land here and become a signed-in session.
export async function GET(req: Request) {
  const url = new URL(req.url); const code = url.searchParams.get("code"); const next = url.searchParams.get("next") ?? "/";
  if (code) { const db = await supabaseServer(); const { error } = await db.auth.exchangeCodeForSession(code); if (error) return NextResponse.redirect(`${url.origin}/login?link=expired`); }
  return NextResponse.redirect(`${url.origin}${next.startsWith("/") ? next : "/"}`);
}
