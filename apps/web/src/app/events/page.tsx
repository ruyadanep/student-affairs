import { supabaseServer } from "@/lib/supabase/server";
import { Rsvp, RequestEvent } from "./Client";

export const metadata = { title: "Events" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  const since = new Date(Date.now() - 86400000).toISOString();
  const { data: events } = await db.from("events").select("id,title,venue,description,starts_at,capacity").eq("status", "approved").gte("starts_at", since).order("starts_at");
  const mine = user ? ((await db.from("event_rsvps").select("event_id").eq("student_id", user.id)).data ?? []).map((r: { event_id: string }) => r.event_id) : [];
  const orgs = user ? ((await db.from("organisations").select("id,name").eq("status", "approved").order("name")).data ?? []) : [];
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <h1 className="text-2xl font-bold">Events</h1>
      <ul className="space-y-3">
        {(events ?? []).length === 0 && <li className="text-sm text-gray-700">No upcoming events yet.</li>}
        {(events ?? []).map((e: { id: string; title: string; venue: string; description: string | null; starts_at: string; capacity: number | null }) => (
          <li key={e.id} className="rounded border p-4">
            <h2 className="font-semibold">{e.title}</h2>
            <p className="text-sm text-gray-700">{new Date(e.starts_at).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })} · {e.venue}{e.capacity ? ` · ${e.capacity} places` : ""}</p>
            {e.description && <p className="mt-1 text-sm">{e.description}</p>}
            <div className="mt-2">{user ? <Rsvp eventId={e.id} going={mine.includes(e.id)} /> : <a href="/login?next=/events" className="text-sm text-[#0b5c36] underline">Sign in to RSVP</a>}</div>
          </li>))}
      </ul>
      {user && <section><h2 className="mb-2 text-lg font-semibold">Request an event</h2><RequestEvent orgs={orgs} /></section>}
    </main>
  );
}
