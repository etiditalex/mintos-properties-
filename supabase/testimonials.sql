-- Run in Supabase SQL Editor if testimonials table is missing.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_image_url text,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_testimonials_published on public.testimonials(published);
create index if not exists idx_testimonials_display_order on public.testimonials(display_order);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials_select_published" on public.testimonials;
create policy "testimonials_select_published"
on public.testimonials
for select
to anon, authenticated
using (published = true);

drop policy if exists "testimonials_staff_all" on public.testimonials;
create policy "testimonials_staff_all"
on public.testimonials
for all
to authenticated
using (public.current_user_role() in ('agent', 'admin'))
with check (public.current_user_role() in ('agent', 'admin'));
