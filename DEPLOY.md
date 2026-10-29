# Deploying the PLASU Student Affairs platform

Target: `studentaffairs.plasu.edu.ng` on Vercel, with a production Supabase project and a Sanity project.

## 1. Before you start
- Fill in `apps/web/src/lib/site.ts` (office email, phone, hours, `dpoEmail`).
- Get the Dean's approval of the letter and certificate wording.
- Decide who will be the first TWO super admins (the two-person rule starts at two).

## 2. Production Supabase
1. Create a **new** project (do not reuse the test one). Choose a region close to Nigeria (e.g. Europe/West).
2. SQL editor: run each file **one at a time, in order, each in its own run**: `0001` … `0020`, then optionally `seed_test_data.sql` ONLY on a test project, never production.
3. Run `0021_directorate_units.sql` (the six Student Affairs units in clearance order), then create the real hostels, rooms and bed spaces (use the staff screens). Give each unit at least one clearance officer under Staff > Setup.
4. Authentication > Providers > Email: turn **Confirm email ON** in production.
5. Authentication > URL configuration: Site URL `https://studentaffairs.plasu.edu.ng`; Redirect URLs `https://studentaffairs.plasu.edu.ng/**`.
6. Authentication > SMTP: add your SMTP (Resend SMTP works) so sign-up and reset emails come from the University domain.
7. Authentication > Attack protection: enable CAPTCHA if offered and keep rate limits on.
8. Project settings > Database > Backups: enable daily backups (paid plan gives point-in-time recovery; strongly recommended).
9. Create the first staff accounts (Authentication > Users > Add user, Auto Confirm), then give roles with the SQL in TESTING.md or the Staff > Users screen.

## 3. Sanity
Create a Sanity project, put its project id and dataset in the env vars you already use, and add the Vercel domain under API > CORS origins.

## 4. Vercel
1. Import the repo, set **Root Directory** to `apps/web`.
2. Environment variables (Production): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (use the legacy anon key), `SUPABASE_SERVICE_ROLE_KEY` (server only, never prefix with NEXT_PUBLIC), the Sanity ones, plus everything in `.env.addon.example`.
3. Copy `vercel.json` to the repo root or `apps/web` (wherever Vercel's root is). It runs the message sender daily and the Dean's digest monthly.
   - Vercel Hobby only allows daily crons. For faster delivery (every 5 to 10 minutes) either use Vercel Pro, or point a free pinger (cron-job.org) at `https://YOUR-DOMAIN/api/cron/messages` with the header `Authorization: Bearer <CRON_SECRET>`.
   - Staff can also press "Send queued messages now" in Staff > Delivery queue.
4. Add the domain `studentaffairs.plasu.edu.ng` under Domains; ICT adds the CNAME record Vercel shows.
5. Merge the CSP snippet from `next.config.csp.snippet.txt`.

## 5. Email and SMS
- **Resend**: add and verify the sender domain (DNS records from ICT), create an API key, set `RESEND_API_KEY` and `EMAIL_FROM`.
- **Termii**: register a sender ID (approval can take days), set `TERMII_API_KEY` and `TERMII_SENDER_ID`. Students only get SMS if they ticked it on My account.
- Switch on key-alert emails later in Staff > Security > Settings (`email_key_alerts` = true).

## 6. Go-live checklist
- [ ] Two super admins exist; the test admin account is removed or its password changed.
- [ ] Staff two-step sign-in: every staff member has enrolled an authenticator app, THEN set `require_staff_mfa` = true.
- [ ] Service role key is only in Vercel env vars, not in git.
- [ ] `.env.local` is in `.gitignore`.
- [ ] Privacy notice reviewed by the DPO; `dpoEmail` filled in.
- [ ] Backups on; you have tried restoring one to a scratch project.
- [ ] A test student registered, applied, cleared and signed out successfully on the live site.
- [ ] Idle sign-out works (30 minutes) and the login history shows the test sign-in.
- [ ] Run through TESTING.md sections for the new features (below) on the live site with test accounts.

## 7. Running costs and limits to watch
Supabase free tier pauses inactive projects and has limited storage; use Pro for production. Resend and Termii are pay-per-use. Keep an eye on the Delivery queue for failed messages.
