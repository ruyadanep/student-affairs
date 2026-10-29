"use client";
import { useState } from "react";
// Same lockup as the ICT Directorate site: university small on top, unit bold below.
// Drop the real crest at apps/web/public/logo.png; until then an initials badge shows.
export default function Logo() {
  const [missing, setMissing] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
      {missing ? (
        <div aria-hidden style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>SA</div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/logo.png" alt="Plateau State University crest" width={48} height={48} onError={() => setMissing(true)} />
      )}
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontSize: ".75rem", letterSpacing: ".04em", color: "var(--muted)", textTransform: "uppercase" }}>Plateau State University</div>
        <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--brand)", textTransform: "uppercase" }}>Student Affairs</div>
      </div>
    </div>
  );
}
