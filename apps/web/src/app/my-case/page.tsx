import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Appeal from "./Appeal";

export const metadata = { title: "My case" };
export const dynamic = "force-dynamic";
const t = (s: string) => new Date(s).toLocaleString("en-NG");

export default async function Page() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/my-case");
  const { data: cases } = await db.from("discipline_cases").select("id,case_no,category,summary,status").eq("student_id", user.id).order("created_at", { ascending: false });
  const { data: holds } = await db.from("clearance_holds").select("id,reason").eq("student_id", user.id).is("lifted_at", null);
  const blocks = await Promise.all((cases ?? []).map(async (c: { id: string }) => ({
    ev: (await db.from("case_events").select("id,note,created_at").eq("case_id", c.id).order("created_at")).data ?? [],
    hr: (await db.from("case_hearings").select("id,scheduled_at,venue").eq("case_id", c.id)).data ?? [],
    sn: (await db.from("case_sanctions").select("id,kind,details,ends_on").eq("case_id", c.id)).data ?? [],
    ap: (await db.from("case_appeals").select("id,status,decision_note").eq("case_id", c.id)).data ?? [],
  })));
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 text-sm">
      <h1 className="text-2xl font-bold">My case</h1>
      {(holds ?? []).map((h: { id: string; reason: string }) => <p key={h.id} className="rounded bg-amber-50 p-3 text-amber-900">Clearance hold: {h.reason}. Contact the Dean's office.</p>)}
      {(cases ?? []).length === 0 && <p>You have no case notices.</p>}
      {(cases ?? []).map((c: { id: string; case_no: string; category: string; summary: string; status: string }, i: number) => (
        <section key={c.id} className="space-y-3 rounded border p-4">
          <h2 className="font-semibold">{c.case_no} · {c.category} <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs">{c.status}</span></h2>
          <p>{c.summary}</p>
          {blocks[i].hr.map((h: { id: string; scheduled_at: string; venue: string }) => <p key={h.id}><b>Hearing:</b> {t(h.scheduled_at)} at {h.venue}</p>)}
          {blocks[i].ev.map((e: { id: string; note: string; created_at: string }) => <p key={e.id} className="border-l-2 pl-2">{e.note}<span className="block text-xs text-gray-600">{t(e.created_at)}</span></p>)}
          {blocks[i].sn.map((s: { id: string; kind: string; details: string | null; ends_on: string | null }) => <p key={s.id}><b>Decision:</b> {s.kind}{s.details ? `: ${s.details}` : ""}{s.ends_on ? ` (until ${s.ends_on})` : ""}</p>)}
          {blocks[i].ap.map((a: { id: string; status: string; decision_note: string | null }) => <p key={a.id}><b>Appeal:</b> {a.status}{a.decision_note ? `: ${a.decision_note}` : ""}</p>)}
          {c.status === "decided" && <div><h3 className="mb-2 font-semibold">Appeal this decision</h3><Appeal id={c.id} /></div>}
        </section>))}
      <p><Link href="/privacy" className="text-[#0b5c36] underline">How we handle your data</Link></p>
    </main>
  );
}
