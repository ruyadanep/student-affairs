# Testing the new features (flows AG onward)

Use a test Supabase project with the seed data. Sign in as the role named in each flow.

**AG. Payment reconciliation** (hostel_officer) Create a CSV with columns `reference,amount` using two references from pending payments (one with the right amount, one too low) and one unknown reference. Staff > Payments > upload. Expect 1 verified, 1 amount problem, 1 not found. Upload the same file again: the verified one shows "already verified".

**AH. Auto-allocation** Make sure the current session has submitted applications with verified payments, including one marked medical (Staff > Allocation > Priority). Run allocation. Expect the medical student placed first, hostels matching gender, students notified. A student with no free bed becomes waitlisted. Run again: nothing changes.

**AI. Swap** Swap two allocated students of the same gender. Both see their new beds under My hostel; old allocations show as vacated. Try swapping a male and a female across single-gender hostels: refused.

**AJ. Bulk clearance** (clearance_officer assigned to a unit) Staff > Clearance > Bulk approval. Only students whose earlier units have cleared are approved; a student with a clearance hold is skipped.

**AK. Workload** Open Staff > Workload. Items older than 3 days show "overdue".

**AL. Email/SMS** Set the env keys. Send an announcement with Email ticked. A student with email alerts on gets one; a student who turned it off does not. Staff > Delivery queue > Send now. Failed messages show the provider error. SMS goes only to students who ticked SMS and have a phone number.

**AM. Scheduling and templates** Save a template, start a new announcement from it, schedule it two minutes ahead, then press Send now in the queue after that time: it is released. Cancel a scheduled one: it never sends.

**AN. Key alerts and digest** Set `email_key_alerts` true. Return a clearance step: the student is emailed. Call `/api/cron/digest` with the `Authorization: Bearer <CRON_SECRET>` header: each Dean's office user gets one queued email.

**AO. Events** Student requests an event at /events. Dean's office or org officer approves under Staff > Events. It appears publicly; a student RSVPs; staff check in by matric number. A declined request needs a reason and notifies the student.

**AP. Elections** (dean_office) Create an election, add two positions with candidates, load the voter roll, open it. A student votes once; a second attempt is refused; a student not on the roll cannot vote. While open, results are not visible. Close, view results as Dean, publish: results are public. Check in SQL that `ballots` has no voter column and no timestamp.

**AQ. Discipline** Dean opens a case. A student cannot see it until "Notify the student". Add a staff-only note and a student-visible note; the student sees only the second. Assign a staff member: they see only that case. Opening the case writes a `read_case` row in the audit log. Record a sanction; the student can appeal once.

**AR. Clearance holds** Place a hold. The student sees it on My case. A clearance officer's approval fails with the hold message; bulk approval skips that student. Lift the hold: approval works.

**AS. Login history and idle sign-out** Sign in; Staff > Security shows the sign-in. Leave a page untouched for the idle time (temporarily set `idleMinutes={1}` on SessionGuard to test): you are signed out and sent to /login.

**AT. Two-person super admin** With one super admin, granting a second works directly. With two, requesting a third creates a pending request; the requester cannot approve their own; the other super admin can. Direct SQL insert of a super_admin role is refused.

**AU. NDPA tools** On My account: Download my data returns a JSON file with only that student's data. Send a correction request; the Dean's office answers under Staff > Data protection requests and the student is notified. Super admin anonymises a student with no bed or hold: name, email, phone are gone, the student cannot sign in, allocation history remains.

**AV. Hostel desk** Log a visitor in and out, add a found item and mark it handed over (a student sees it on /lost-found), add inventory and change a quantity.

**AW. Settings** Staff > Security > Settings: changing `overdue_days` to a word is refused; `require_staff_mfa` only accepts true or false.

**AX. Units** Open /units: six units listed with descriptions; each unit anchor works. Home and About show the six units. In Staff > Team, the Unit box is a drop-down of the six; set a member's unit and they appear under that unit on /units and grouped on /team. At /clearance a student sees each unit's short description. Start clearance with the 6 units seeded: six steps in the order Accommodation, Identity Card, Sports, Guidance and Counselling, NYSC, Record.
