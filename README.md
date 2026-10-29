# Student Affairs Platform (PLASU)
Monorepo, same method as the Career Centre: `apps/web` (Next.js + Route Handlers -> Supabase with RLS), `apps/cms` (Sanity), `supabase/migrations`.

Setup: `npm install`, copy `.env.example` to `.env.local`, run `supabase/migrations/0001_phase1_schema.sql` in the Supabase SQL editor, then `npm run dev`.
Payments are made on plasu.edu.ng; this app only checks status (`/api/payments/verify`). Copy colour tokens from the ICT Directorate site into `apps/web/src/app/globals.css`.
Next: UI for each Phase 1 module, PDF + QR letter generation, announcement fan-out to `notifications`.
