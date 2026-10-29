# End-to-end test walkthrough

Use a **fresh Supabase project** and test data only. Do not use real student data.

## 1. Set up

1. In the Supabase SQL editor, run these in order: `0001_phase1_schema.sql`, `0002_staff_notifications.sql`, `0003_clearance_logic.sql`, `0004_documents_bucket.sql`, `0005_new_user_profile.sql`, `0006_org_leave.sql`, `0007_enrolled_students.sql`, `0008_announcements.sql`, `0009_clearance_certificate.sql`, `0010_contact_messages.sql`. Each should say "Success". Stop and fix the first one that errors.
2. Run `seed_test_data.sql` (current session, 2 hostels with rooms and beds, 5 clearance units, 3 test students).
3. In **Authentication > Providers > Email**, turn **Confirm email** off for testing. Turn it back on before launch.
4. Fill `apps/web/.env.local`: Supabase URL, anon (or publishable) key, secret/service role key, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
5. `npm install`, then `npm run dev` from the project root.

## 2. Create your staff account

1. **Authentication > Users > Add user**: your email and a password, tick "Auto Confirm User".
2. In the SQL editor (use your email), make yourself super admin and assign yourself every clearance unit:
```sql
insert into user_roles(user_id, role) select id, 'super_admin' from profiles where email = 'YOU@example.com' on conflict do nothing;
insert into unit_officers(user_id, unit_id) select p.id, u.id from profiles p, clearance_units u where p.email = 'YOU@example.com' on conflict do nothing;
```
3. Sign in at `/login`, open `/staff`. **Expect:** the list of staff tools.

## 3. Test flows

Use two browsers (or one normal, one private window): **staff** in one, **student** in the other.

| # | Flow | Steps | Expected |
|---|------|-------|----------|
| A | Student sign-up | `/register`: matric `PLASU/TEST/0001`, any email, password 8+ chars. Then try the same matric again. | First works and signs in. Second says it already has an account. Wrong matric says it can't be found. |
| B | Hostel (male) | Student 1 at `/hostels`: first choice Test Hall A, reference `TEST-REF-001`. Staff at `/staff/hostels`: Confirm payment, then Allocate bed. | Student sees status change to allocated with hostel, room, bed. A notification arrives. |
| C | Gender rule | Register `PLASU/TEST/0002` (female). Apply with Test Hall A first, Test Hall B second, reference `TEST-REF-002`. Confirm and allocate. | Allocated in **Test Hall B**, not A. |
| D | Maintenance | Student 1 at `/maintenance`: report a plumbing fault. Staff at `/staff/maintenance`: Take this, Mark fixed. | Room shows automatically. Student gets a "fixed" notification and can post a message. |
| E | Letters | Student 1 at `/letters`: request a letter of good standing. Staff at `/staff/letters`: Approve and issue. Student downloads the PDF, scans the QR code. | PDF has crest, details, QR. `/verify/<code>` says valid with the student's name. |
| F | Clearance | Student 1 at `/clearance`: Start. Staff at `/staff/clearance`: try to approve **Bursary first**. Then approve in order. Try Return on one with a reason. | Out-of-order approval is blocked. Return needs a reason and the student sees it. After all five approve: Cleared badge, certificate downloads, QR verifies. |
| G | Organisations | Student 1: `/organisations/new`, register "Test Chess Club". Staff at `/staff/organisations`: approve. Student 2 joins, then leaves. | Appears in directory after approval. Join and leave update the count. |
| H | Announcements | Staff at `/staff/announcements`: level 200, click Check recipients, then Send. | Count matches your test students. Both see a notification and the bell count. A level 400 announcement reaches only student 3. |
| I | Contact | Logged out, send a message at `/contact`. Staff at `/staff/messages`. | Message appears. Mark handled removes it. |
| J | Import | Staff at `/staff/students`: upload `students-template.csv`. | Counts update. Registering one of those matric numbers works. |

## 4. Security checks (these matter most)

- Logged in as a **student**, open `/staff/setup`, `/staff/hostels`, `/staff/letters`. **Expect:** "This page is for ... staff", no data.
- Copy student 1's letter PDF address (`/api/letters/<id>/pdf`) and open it as student 2. **Expect:** Not found.
- Logged out, open `/hostels` and `/clearance`. **Expect:** redirect to login.
- Logged out, open `/verify/NOTACODE`. **Expect:** "No valid document matches this code".
- In the SQL editor, run `select count(*) from audit_log;`. **Expect:** entries for allocations, payments, clearance steps, and issued letters.
- Try registering with an email that differs from one set on an imported student. **Expect:** "Use the email address the university has on record".

## 5. Write down

For anything unexpected, note the page, what you clicked, what you expected, and the exact message (or browser console error). Send those to me and I'll fix them in one batch.

## 6. Clean up test data

```sql
delete from announcements; delete from notifications; delete from contact_messages;
delete from clearance_requests; delete from document_requests; delete from organisations;
delete from maintenance_tickets; delete from allocations; delete from hostel_applications; delete from payment_records;
delete from enrolled_students where matric_no like 'PLASU/TEST/%';
delete from bed_spaces where room_id in (select id from rooms where hostel_id in (select id from hostels where name like 'Test Hall%'));
delete from rooms where hostel_id in (select id from hostels where name like 'Test Hall%');
delete from hostels where name like 'Test Hall%';
```
Then delete the test student users under **Authentication > Users**.

## Known gaps (not bugs)

- Email and SMS delivery for announcements (in-app only so far).
- Room-change requests and check-in/out screens.
- Resubmitting a returned clearance step (the officer re-approves).
- Event requests and Students' Union elections.
- Welfare/counselling and discipline modules (Phases 2 and 3).
- Letter and certificate wording and signature need the Dean's office's approval.

## 7. Added in the second batch (run `0011_phase1_gaps.sql` first)

In Supabase **Authentication > URL Configuration**, add `http://localhost:3000/**` to Redirect URLs.

| # | Flow | Steps | Expected |
|---|------|-------|----------|
| K | Password reset | Log out. `/login` > Forgot your password. Open the email link. Set a new password. | Link signs you in and `/reset-password` accepts the new password. Old password no longer works. |
| L | Room change | Student with a room: Hostels > Request a room change. Staff at `/staff/room-changes`: Approve. Then `/staff/hostels` > Allocate bed. | Old bed is released, student is re-queued and placed in a **different** bed. Rejecting needs a reason. |
| M | Check in/out | Staff at `/staff/residents`: Check in, then Check out. | Student's Hostels page shows the check-in date. Checkout frees the bed. |
| N | Clearance resubmit | Staff returns a clearance step. Student clicks "review again". | Step goes back to pending in the officer's queue. |

## 8. Welfare and support (run `0012_support.sql` first)

Give your account the `welfare_officer` role too if you are not super admin: `/staff/setup` > Give a staff role.

| # | Flow | Steps | Expected |
|---|------|-------|----------|
| O | Counselling | Student 1 at `/support`: request a counselling appointment with preferred times. Staff at `/staff/support`: Start review, Set appointment, post a message. | Student sees "Appointment set" with the date and the staff message. The notification text does **not** repeat what the student wrote. |
| P | Privacy by role | Create a user with only the `dean_office` role. Student submits one counselling request and one complaint. | Dean's office sees the **complaint only**. Welfare officer sees both. |
| Q | Resolve | Staff clicks Resolve with a note, then Close. | Student sees the note. Closed requests drop out of the staff list. |
| R | Audit log | In SQL: `select meta from audit_log where entity = 'support_requests';` | Rows show category and status only, never the student's words. |

## 9. Team profiles (run `0013_staff_team.sql`, then `npm install` for the new `sharp` package)

| # | Flow | Steps | Expected |
|---|------|-------|----------|
| S | Add and publish | `/staff/team` as super admin: add a member with a name, title, and bio, tick "Show on the public team page". Upload a large phone photo. | `/team` shows the card with a square, cropped photo. Unticking publish hides it. |
| T | Own profile | Add a member with **Account email** set to a staff user's email. Sign in as that user and open `/staff/team`. | They see only their own profile and can edit the bio and photo, but not the name, title, or publish setting. |
| U | Bad files | Try uploading a PDF, then a file over 5 MB. | Clear messages, nothing saved. |
