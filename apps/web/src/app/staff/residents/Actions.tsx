"use client";
export default function Actions({ id, checkedIn }: { id: string; checkedIn: boolean }) {
  async function go(action: string) {
    if (action === "check_out" && !confirm("Check this student out? Their bed becomes free.")) return;
    const r = await fetch("/api/staff/residents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    if (r.ok) location.reload(); else alert((await r.json()).error);
  }
  return (<div style={{ display: "flex", gap: ".4rem" }}>{!checkedIn && <button className="btn" onClick={() => go("check_in")}>Check in</button>}<button className="btn-outline" onClick={() => go("check_out")}>Check out</button></div>);
}
