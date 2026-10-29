import Link from "next/link";
import { requireRole } from "@/lib/staffGuard";
import Upload from "./Upload";

export const metadata = { title: "Payment reconciliation" };

export default async function Page() {
  const { db } = await requireRole(["hostel_officer"], "/staff/payments");
  const { count } = await db.from("payment_records").select("id", { count: "exact", head: true }).eq("status", "pending_check");
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/staff" className="text-sm text-[#0b5c36] underline">← Staff tools</Link>
      <h1 className="mt-2 text-2xl font-bold">Payment reconciliation</h1>
      <p className="mt-2 text-sm text-gray-700">Payments are made on plasu.edu.ng. Upload the Bursary's CSV (columns <code>reference</code> and <code>amount</code>) and every matching pending payment is verified at once. This platform never handles money.</p>
      <p className="mt-2 text-sm"><b>{count ?? 0}</b> payments are waiting for a check.</p>
      <div className="mt-6"><Upload /></div>
    </main>
  );
}
