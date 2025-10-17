-- Moderations schema for admin dashboard

create table if not exists public.moderations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('bug','report','appeal','system')),
  title text not null,
  description text,
  severity text check (severity in ('low','medium','high','critical')),
  reported_by text,
  status text not null check (status in ('open','in_review','resolved','closed')) default 'open',
  link text,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists moderations_created_at_idx on public.moderations (created_at desc);
create index if not exists moderations_status_idx on public.moderations (status);
create index if not exists moderations_type_idx on public.moderations (type);

-- Enable RLS
alter table public.moderations enable row level security;

-- Admin-only read access policy using profiles table
drop policy if exists "Admins can read moderations" on public.moderations;
create policy "Admins can read moderations" on public.moderations
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Optional: Admin-only write access (comment out if not desired)
drop policy if exists "Admins can write moderations" on public.moderations;
create policy "Admins can write moderations" on public.moderations
  for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Seed sample data (safe to run multiple times; ids random)
insert into public.moderations (type, title, description, severity, reported_by, status, link)
values
  ('bug', 'Chart labels overflow on small screens', 'x-axis labels overlap on devices < 360px width', 'medium', 'QA Bot', 'open', '/admin/analytics'),
  ('report', 'Player reported for spam messaging', 'User @fastShooter sent 40+ unsolicited messages in 10m', 'high', '@fan_482', 'in_review', '/admin/users'),
  ('appeal', 'Appeal: temporary block on @creatorJ', 'Requests unblock after 24h; claims false positives', 'low', '@creatorJ', 'open', null),
  ('system', 'RLS policy denies analytics read for admin shadow user', 'Check Supabase row level security for analytics tables', 'critical', 'System', 'resolved', null),
  ('bug', 'Video upload occasionally fails', 'Intermittent 500 from /api/videos on large files', 'medium', 'QA Team', 'open', '/admin/analytics'),
  ('report', 'Harassment report', 'Fan reports abusive comments under player post', 'high', '@fan_223', 'in_review', '/admin/users'),
  ('system', 'Ads metrics delayed', 'ETL job ran late; check cron schedule', 'low', 'System', 'open', '/admin/analytics'),
  ('appeal', 'Ad rejection appeal', 'Publisher appeals ad creative rejection', 'medium', '@pub_92', 'open', '/admin/analytics')
on conflict do nothing;


