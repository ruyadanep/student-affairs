# What changed in this version

- **Six directorate units** (Accommodation, Guidance and Counselling, Identity Card, NYSC, Record, Sports) are now the clearance units (`0021`), and appear on a new /units page, Home, About, footer, nav, FAQ, student clearance screen, team editor (drop-down) and team page (grouped). The single list lives in `apps/web/src/lib/units.ts`; the unit descriptions there are plain placeholders for the Dean's office to confirm.
- **Restored** migrations `0014`/`0015` and the Reports, Audit, Quality, Lookup, Users, Rollover and two-step sign-in (MFA) pages and middleware, which were missing from the project. Both migrations are safe to re-run.
- **Fixed** the payments page build error (`lib/csv.ts` was missing).
- **Restyled** the add-on pages to match the site's own design (they were written with a CSS system the project does not use).
- **Wired in** SessionGuard (login history, idle sign-out), nav and footer links, staff dashboard cards, the production CSP, idle sign-out message on login, and read-logging on the support queue.
