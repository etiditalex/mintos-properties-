-- Run this in Supabase SQL Editor if your project was created before blog_posts existed.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null default '',
  published boolean not null default false,
  author_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_author_id on public.blog_posts(author_id);
create index if not exists idx_blog_posts_published on public.blog_posts(published);

alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts_select_published" on public.blog_posts;
create policy "blog_posts_select_published"
on public.blog_posts
for select
to anon, authenticated
using (published = true);

drop policy if exists "blog_posts_select_own" on public.blog_posts;
create policy "blog_posts_select_own"
on public.blog_posts
for select
to authenticated
using (author_id = auth.uid());

drop policy if exists "blog_posts_select_admin" on public.blog_posts;
create policy "blog_posts_select_admin"
on public.blog_posts
for select
to authenticated
using (public.current_user_role() = 'admin');

drop policy if exists "blog_posts_insert_staff" on public.blog_posts;
create policy "blog_posts_insert_staff"
on public.blog_posts
for insert
to authenticated
with check (
  author_id = auth.uid()
  and public.current_user_role() in ('agent', 'admin')
);

drop policy if exists "blog_posts_update_own" on public.blog_posts;
create policy "blog_posts_update_own"
on public.blog_posts
for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists "blog_posts_update_admin" on public.blog_posts;
create policy "blog_posts_update_admin"
on public.blog_posts
for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "blog_posts_delete_own" on public.blog_posts;
create policy "blog_posts_delete_own"
on public.blog_posts
for delete
to authenticated
using (author_id = auth.uid());

drop policy if exists "blog_posts_delete_admin" on public.blog_posts;
create policy "blog_posts_delete_admin"
on public.blog_posts
for delete
to authenticated
using (public.current_user_role() = 'admin');
