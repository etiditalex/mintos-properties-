-- Fix "Staff access" / client role when you know the login email.
-- Run in Supabase → SQL Editor for THIS project (same URL as NEXT_PUBLIC_SUPABASE_URL).
--
-- 1) DIAGNOSE: auth user vs profile (role comes from public.profiles)
select
  u.id as auth_id,
  u.email as auth_email,
  p.email as profile_email,
  p.role,
  p.full_name
from auth.users u
left join public.profiles p on p.id = u.id
order by u.created_at desc;

-- 2) PROMOTE: set admin using Auth email (fixes typos in profiles.email if auth is correct)
-- Replace your-email@example.com below with the address you use to sign in (Google OAuth uses that email).
update public.profiles p
set role = 'admin'::public.app_role
from auth.users u
where u.id = p.id
  and lower(trim(u.email)) = lower(trim('your-email@example.com'));

-- 3) VERIFY
select u.email, p.role
from auth.users u
join public.profiles p on p.id = u.id
where lower(trim(u.email)) = lower(trim('your-email@example.com'));

-- 4) IF STEP 2 updated 0 rows: profile row missing — create/link from Auth (then set admin)
insert into public.profiles (id, full_name, email, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email,
  'admin'::public.app_role
from auth.users u
where lower(trim(u.email)) = lower(trim('your-email@example.com'))
on conflict (id) do update set role = excluded.role;
