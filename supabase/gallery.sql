-- Gallery images for public / marketing pages.
-- Run in Supabase SQL Editor.

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_images_published on public.gallery_images(published);
create index if not exists idx_gallery_images_display_order on public.gallery_images(display_order);

alter table public.gallery_images enable row level security;

drop policy if exists "gallery_images_select_published" on public.gallery_images;
create policy "gallery_images_select_published"
on public.gallery_images
for select
to anon, authenticated
using (published = true);

drop policy if exists "gallery_images_staff_all" on public.gallery_images;
create policy "gallery_images_staff_all"
on public.gallery_images
for all
to authenticated
using (public.current_user_role() in ('agent', 'admin'))
with check (public.current_user_role() in ('agent', 'admin'));

