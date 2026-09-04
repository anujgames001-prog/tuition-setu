# TuitionSetu full-stack MVP

This project adds real authentication, database-backed tutor listings, student enquiries, dashboards, and an admin approval screen to the TuitionSetu concept.

## One-time setup

1. Create a project at [Supabase](https://supabase.com), then run `supabase/schema.sql` in its SQL Editor.
2. Copy `.env.example` to `.env.local`, then add the project URL and **publishable/anon key** from Supabase Project Settings > API. Never put a `service_role`/secret key in this file.
3. In Supabase Auth, enable Email and Password. To enable mobile OTP, configure Phone Auth with an SMS provider (such as Twilio, MessageBird, Vonage, or Textlocal) and turn on phone confirmation.
4. Sign up with your own account, find its UUID in Authentication > Users, then run the last `update profiles` line in `schema.sql` with that UUID to make yourself admin.
5. Install Node.js (it was not installed in this workspace), run `npm install`, then `npm run dev` inside this folder. Open `http://localhost:3000`.

## User data

- Supabase Auth stores login identities; password hashes are never readable in this app.
- `profiles` stores the user role and basic account data.
- `tutor_listings` stores public classes; they must be approved before student search can see them.
- `enquiries` stores the student-to-tutor lead pipeline.
- RLS policies ensure students can see only their own enquiries and tutors can see only enquiries for their own listings.

## Key routes

- `/auth` — Email/password signup and login, plus mobile OTP sign-in.
- `/student` — Student search and free-demo enquiry creation.
- `/tutor/new` — Tutor/coaching profile submission.
- `/dashboard` — Tutor listings and leads, or student enquiry history.
- `/admin` — Pending listing approval (requires the `admin` role).
