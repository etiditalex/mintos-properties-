-- Run after schema.sql. Adds listing intent + searchable tags for the public “Find your home” drawer.
alter table public.properties
  add column if not exists listing_mode text not null default 'sale';

alter table public.properties
  drop constraint if exists properties_listing_mode_check;

alter table public.properties
  add constraint properties_listing_mode_check check (listing_mode in ('sale', 'rent'));

alter table public.properties
  add column if not exists feature_tags text[] not null default '{}';
