"use client";
export default function Actions({ appId, payId, status, payStatus }: { appId: string; payId: string | null; status: string; payStatus: string | null }) {
  async function go(action: string, id: string) {
    const r = await fetch("/api/staff/hostel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, id }) });
    if (!r.ok) alert((await r.json()).error ?? "Something went wrong."); else location.reload();
  }
  return (<div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
    {payId && payStatus === "pending_check" && (<><button className="btn-outline" onClick={() => go("verify_payment", payId)}>Confirm payment</button><button className="btn-outline" onClick={() => go("reject_payment", payId)}>Reject</button></>)}
    {status === "eligible" && <button className="btn" onClick={() => go("allocate", appId)}>Allocate bed</button>}
  </div>);
}
