import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import RpcForm from "@/components/RpcForm";

export const metadata = { title: "Hostel desk" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { db } = await requireRole(["hostel_officer"], "/staff/hostel-desk");
  const [{ data: hostels }, { data: inside }, { data: lost }, { data: inv }] = await Promise.all([
    db.from("hostels").select("id,name").order("name"),
    db.from("visitor_log").select("id,visitor_name,resident_matric,in_at,hostels(name)").is("out_at", null).order("in_at"),
    db.from("lost_items").select("id,description,found_where").eq("status", "found").order("found_on", { ascending: false }),
    db.from("hostel_inventory").select("id,item,quantity,condition,hostels(name)").order("item"),
  ]);
  const hopts = (hostels ?? []).map((h: { id: string; name: string }) => [h.id, h.name] as [string, string]);
  const nm = (x: unknown) => { const h = x as { name: string } | { name: string }[] | null; return (Array.isArray(h) ? h[0] : h)?.name ?? ""; };
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 text-sm">
      <Link href="/staff">← Staff tools</Link>
      <h1 className="text-2xl font-bold">Hostel desk</h1>
      <section className="space-y-3 rounded border p-4"><h2 className="font-semibold">Visitors now inside ({(inside ?? []).length})</h2>
        <ul className="divide-y">{(inside ?? []).map((v: { id: string; visitor_name: string; resident_matric: string | null; in_at: string; hostels: unknown }) => (
          <li key={v.id} className="flex items-center justify-between gap-3 py-2"><span>{v.visitor_name} → {v.resident_matric ?? "n/a"} · {nm(v.hostels)} · since {new Date(v.in_at).toLocaleTimeString("en-NG", { timeStyle: "short" })}</span>
            <RpcForm fn="checkout_visitor" hidden={{ p_id: v.id }} fields={[]} button="Check out" /></li>))}</ul>
        <RpcForm fn="log_visitor" button="Log visitor in" fields={[{ name: "p_hostel", label: "Hostel", type: "select", options: hopts }, { name: "p_name", label: "Visitor name", required: true }, { name: "p_matric", label: "Resident's matric no." }, { name: "p_purpose", label: "Purpose" }]} /></section>

      <section className="space-y-3 rounded border p-4"><h2 className="font-semibold">Lost and found</h2>
        <ul className="divide-y">{(lost ?? []).map((l: { id: string; description: string; found_where: string | null }) => (
          <li key={l.id} className="flex items-end justify-between gap-3 py-2"><span>{l.description}{l.found_where ? ` (${l.found_where})` : ""}</span>
            <RpcForm fn="resolve_lost_item" hidden={{ p_id: l.id }} button="Handed over" fields={[{ name: "p_claimant", label: "Collected by", required: true }]} /></li>))}</ul>
        <RpcForm fn="add_lost_item" button="Add found item" fields={[{ name: "p_description", label: "Item", required: true }, { name: "p_where", label: "Where found" }]} /></section>

      <section className="space-y-3 rounded border p-4"><h2 className="font-semibold">Inventory</h2>
        <ul className="divide-y">{(inv ?? []).map((i: { id: string; item: string; quantity: number; condition: string; hostels: unknown }) => (
          <li key={i.id} className="flex items-end justify-between gap-3 py-2"><span>{nm(i.hostels)} · {i.item}: <b>{i.quantity}</b> ({i.condition})</span>
            <RpcForm fn="update_inventory" hidden={{ p_id: i.id }} button="Update" fields={[{ name: "p_qty", label: "Qty", type: "number", required: true }, { name: "p_condition", label: "Condition" }]} /></li>))}</ul>
        <RpcForm fn="add_inventory" button="Add or set item" fields={[{ name: "p_hostel", label: "Hostel", type: "select", options: hopts }, { name: "p_item", label: "Item (e.g. mattress)", required: true }, { name: "p_qty", label: "Quantity", type: "number", required: true }, { name: "p_condition", label: "Condition" }]} /></section>
    </main>
  );
}
