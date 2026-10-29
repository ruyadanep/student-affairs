import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
// Keeps sign-in fresh on every page. When two-step verification is switched on, staff pages require it.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return response;
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list: { name: string; value: string; options?: any }[]) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (user && path.startsWith("/staff")) {
    try {
      const { data: setting } = await supabase.from("app_settings").select("value").eq("key", "require_staff_mfa").maybeSingle();
      if (setting?.value === "true") {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
        if ((roles ?? []).some((r) => r.role !== "student")) {
          const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
          if (aal && aal.currentLevel !== "aal2") {
            const url = request.nextUrl.clone(); url.pathname = aal.nextLevel === "aal2" ? "/mfa/verify" : "/mfa/setup"; url.search = `?next=${encodeURIComponent(path)}`;
            const redirect = NextResponse.redirect(url); response.cookies.getAll().forEach((c) => redirect.cookies.set(c)); return redirect;
          }
        }
      }
    } catch { /* if the check fails, the database rules still apply */ }
  }
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)"] };
