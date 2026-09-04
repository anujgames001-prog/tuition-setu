-- TuitionSetu database and Row Level Security policies.
-- Run this whole file in Supabase Dashboard > SQL Editor.
create type public.user_role as enum ('student', 'tutor', 'admin');
create type public.listing_status as enum ('pending', 'active', 'rejected');
create type public.enquiry_status as enum ('new', 'contacted', 'closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'student',
  full_name text,
  phone text,
  city text,
  created_at timestamptz not null default now()
);
create table public.tutor_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 100),
  category text not null,
  city text not null,
  locality text,
  fee_from integer check (fee_from >= 0),
  fee_to integer check (fee_to >= 0),
  modes text[] not null default '{At institute}',
  description text,
  status public.listing_status not null default 'pending',
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.tutor_listings(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  unique(listing_id, student_id)
);

-- New users receive a profile automatically; browser-provided metadata may choose only student or tutor.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, case when new.raw_user_meta_data->>'role' = 'tutor' then 'tutor'::public.user_role else 'student'::public.user_role end, new.raw_user_meta_data->>'full_name');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;
create or replace function public.is_tutor() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('tutor','admin')) $$;
create or replace function public.owns_listing(target_id uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.tutor_listings where id = target_id and owner_id = auth.uid()) $$;

-- A user must never be able to promote their own account or publish their own listing.
create or replace function public.protect_profile_role() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.role is distinct from new.role and auth.uid() is not null and not public.is_admin() then raise exception 'Only an admin can change an account role'; end if;
  return new;
end; $$;
create trigger protect_profile_role before update on public.profiles for each row execute procedure public.protect_profile_role();
create or replace function public.protect_listing_status() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.status is distinct from new.status and auth.uid() is not null and not public.is_admin() then raise exception 'Only an admin can change listing status'; end if;
  new.updated_at = now();
  return new;
end; $$;
create trigger protect_listing_status before update on public.tutor_listings for each row execute procedure public.protect_listing_status();

alter table public.profiles enable row level security;
alter table public.tutor_listings enable row level security;
alter table public.enquiries enable row level security;
create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "public sees active listings" on public.tutor_listings for select using (status = 'active' or owner_id = auth.uid() or public.is_admin());
create policy "tutors create own listings" on public.tutor_listings for insert with check (owner_id = auth.uid() and public.is_tutor());
create policy "tutors update own listings" on public.tutor_listings for update using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
create policy "tutors delete own listings" on public.tutor_listings for delete using (owner_id = auth.uid() or public.is_admin());
create policy "students insert own enquiries" on public.enquiries for insert with check (student_id = auth.uid());
create policy "student sees own enquiries" on public.enquiries for select using (student_id = auth.uid() or public.owns_listing(listing_id) or public.is_admin());
create policy "tutor updates own leads" on public.enquiries for update using (public.owns_listing(listing_id) or public.is_admin());

-- IMPORTANT: after you create your first account, run this manually with its profile id:
-- update public.profiles set role = 'admin' where id = 'YOUR-USER-UUID';
