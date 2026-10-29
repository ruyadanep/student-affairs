import { supabaseServer } from "@/lib/supabase/server";
export const metadata = { title: "Lost and found" };
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  const { data } = user ? await db.from("lost_items").select("id,description,found_where,found_on").eq("status", "found").order("found_on", { ascending: false }) : { data: null };
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Lost and found</h1>
      {!user ? <p className="mt-3 text-sm"><a href="/login?next=/lost-found" className="text-[#0b5c36] underline">Sign in</a> to see items waiting to be claimed.</p> : (
        <ul className="mt-4 divide-y rounded border text-sm">{(data ?? []).length === 0 && <li className="p-3">Nothing is waiting to be claimed.</li>}
          {(data ?? []).map((i: { id: string; description: string; found_where: string | null; found_on: string }) => <li key={i.id} className="p-3">{i.description}{i.found_where ? ` · found at ${i.found_where}` : ""} · {i.found_on}</li>)}</ul>)}
      <p className="mt-4 text-sm text-gray-700">To claim an item, bring your ID card to the Student Affairs office.</p>
    </main>
  );
}
