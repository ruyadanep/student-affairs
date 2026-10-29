import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = { title: "Elections" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await supabaseServer();
  const { data } = await db.from("elections").select("id,title,status,opens_at,closes_at").in("status", ["open", "published"]).order("opens_at", { ascending: false });
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Students' Union elections</h1>
      <ul className="mt-4 space-y-3">
        {(data ?? []).length === 0 && <li className="text-sm">No elections right now.</li>}
        {(data ?? []).map((e: { id: string; title: string; status: string; closes_at: string | null }) => (
          <li key={e.id} className="rounded border p-4"><Link href={`/elections/${e.id}`} className="font-semibold">{e.title}</Link>
            <p className="text-sm text-gray-700">{e.status === "open" ? `Voting open until ${e.closes_at ? new Date(e.closes_at).toLocaleString("en-NG") : "closing"}` : "Results published"}</p></li>))}
      </ul>
    </main>
  );
}
