-- Ask Yourselves: core schema (run before 2026-07-18-portraits.sql)
-- Enable anonymous sign-ins in Authentication settings; clients use the publishable key only.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  current_age int,
  future_age int,
  profile_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'future_self')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_user_created_idx on public.messages (user_id, created_at);

alter table public.profiles enable row level security;
alter table public.messages enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "messages_select_own" on public.messages
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "messages_insert_own" on public.messages
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
