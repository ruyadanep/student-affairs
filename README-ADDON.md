# Student Affairs add-on (migrations 0016–0020)

Copy the contents of this folder into your project root (it matches your `supabase/` and `apps/web/src/` layout). **No existing file is overwritten**; everything here is new. A few small manual edits are listed below.

## 1. Database (Supabase SQL editor; one file per run, in order)
`0016_operations.sql`, `0017_messaging.sql`, `0018_events_elections.sql`, `0019_discipline.sql`, `0020_security_privacy.sql`

Note: `0019` replaces `decide_clearance_step` (same behaviour plus a refusal when the student has a hold) and `approve_ready_steps`. Run 0011–0015 first if you have not.
Note: once two super admins exist, `0020` makes the database itself refuse any other way of granting super admin, including the old Staff > Users screen. Use Staff > Security instead.

## 2. Install and env
No new npm packages. Add the variables in `.env.addon.example` to `apps/web/.env.local`. Email and SMS stay switched off until the keys are set (messages simply queue/fail with a clear error).

## 3. Small edits to your existing files
1. `app/layout.tsx`: `import SessionGuard from "@/components/SessionGuard";` and put `<SessionGuard />` just inside `<body>`. This records sign-ins and signs people out after 30 idle minutes (change with `idleMinutes={20}`).
2. `app/staff/page.tsx`: add a link to `/staff/more`. That page lists every new tool, filtered by the viewer's role.
3. Nav or footer: add links to `/events`, `/elections`, `/lost-found`, and (signed-in) `/account`, `/my-case`.
4. `next.config.mjs`: merge `next.config.csp.snippet.txt` (production-only Content-Security-Policy).
5. `app/staff/support/[...]/page.tsx` (the page that shows a support case to staff): add `await logRead(db, "support_requests", id)` using `lib/logRead.ts` so welfare reads are recorded. Discipline reads are already logged.
6. Optional, `login/page.tsx`: show "You were signed out after a period of inactivity" when `?reason=idle`.
7. Put `vercel.json` where Vercel's root is (it schedules the message sender and the monthly digest).

## 4. What each new route is
| Route | Who |
|---|---|
| /staff/payments, /staff/allocation, /staff/hostel-desk | hostel officers |
| /staff/clearance-bulk | clearance officers |
| /staff/workload | Dean's office, hostel officers |
| /staff/announce, /staff/outbox | Dean's office, hostel officers |
| /staff/events | Dean's office, org officers |
| /staff/elections, /staff/privacy | Dean's office |
| /staff/cases | Dean's office; other staff see only cases assigned to them |
| /staff/security | super admins |
| /events, /elections, /lost-found, /account, /my-case | signed-in students (events and election results are public) |

Then follow `DEPLOY.md` and `TESTING-ADDON.md`.

## 5. Honest limits
- The SQL was syntax-checked and the TypeScript type-checked against stand-ins for your existing helper files, but the migrations have **not** been executed against a live database. Run them on your test project first and work through TESTING-ADDON.md.
- Ballot secrecy: ballots have no voter id or timestamp, but the Dean's office with direct database access could still correlate rows by insertion order. For a formally contested election, have ICT review this.
- SMS needs an approved Termii sender ID; delivery to DND numbers can fail on the generic channel.
