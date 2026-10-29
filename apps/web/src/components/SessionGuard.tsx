"use client";
import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

/** Mount once in the root layout. Records one login event per browser session and signs out after inactivity. */
export default function SessionGuard({ idleMinutes = 30 }: { idleMinutes?: number }) {
  useEffect(() => {
    const db = supabaseBrowser();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let active = false;
    let idle = idleMinutes;
    const out = async () => { await db.auth.signOut(); window.location.href = "/login?reason=idle"; };
    const reset = () => { if (!active) return; if (timer) clearTimeout(timer); timer = setTimeout(out, idle * 60000); };
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;
    db.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      active = true;
      db.from("app_settings").select("value").eq("key", "idle_minutes").maybeSingle().then(({ data: s }) => {
        const m = Number(s?.value); if (m >= 5 && m <= 240) { idle = m; reset(); }
      });
      try {
        if (!sessionStorage.getItem("plasu_login_logged")) {
          sessionStorage.setItem("plasu_login_logged", "1");
          fetch("/api/auth/login-event", { method: "POST" }).catch(() => {});
        }
      } catch { /* storage blocked: skip logging */ }
      events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
      reset();
    });
    return () => { if (timer) clearTimeout(timer); events.forEach((e) => window.removeEventListener(e, reset)); };
  }, [idleMinutes]);
  return null;
}
