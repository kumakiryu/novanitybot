-- No Vanity Control Panel — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query

-- ── Users ─────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  discord_id    text unique not null,
  username      text not null,
  avatar        text,
  role          text not null default 'admin',
  created_at    timestamptz default now()
);

-- ── Servers ───────────────────────────────────────────────────────────────────
create table if not exists public.servers (
  id          uuid primary key default gen_random_uuid(),
  guild_id    text unique not null,
  guild_name  text not null,
  guild_icon  text,
  created_at  timestamptz default now()
);

-- ── Verification Configs ──────────────────────────────────────────────────────
create table if not exists public.verification_configs (
  id                   uuid primary key default gen_random_uuid(),
  guild_id             text unique not null references public.servers(guild_id) on delete cascade,
  verified_role_id     text,
  webhook_url          text,
  embed_title          text default 'NO VANITY',
  embed_description    text default 'Verification Required. Click Verify to gain access.',
  embed_color          integer default 14372591,
  embed_footer         text default 'NO VANITY Verification System',
  button_label         text default 'Verify',
  button_style         text default 'Success',
  success_message      text default '🎉 You have been successfully verified!',
  log_verified         boolean default true,
  log_joined           boolean default true,
  log_left             boolean default false,
  log_errors           boolean default true,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ── Embed Templates ───────────────────────────────────────────────────────────
create table if not exists public.embed_templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  title       text,
  description text,
  color       integer default 14372591,
  footer      text,
  author      text,
  thumbnail   text,
  image_url   text,
  created_at  timestamptz default now()
);

-- Default templates
insert into public.embed_templates (name, title, description, color, footer) values
  ('Verification Panel', 'NO VANITY', 'Verification Required. Click Verify to gain access.', 14372591, 'NO VANITY Verification System'),
  ('Welcome Message', 'Welcome!', 'Welcome to the server. Please read the rules before chatting.', 6579450, 'NO VANITY'),
  ('Announcement', 'Important Announcement', 'Please read the following carefully.', 16225850, 'NO VANITY')
on conflict do nothing;

-- ── Announcements ─────────────────────────────────────────────────────────────
create table if not exists public.announcements (
  id          uuid primary key default gen_random_uuid(),
  guild_id    text references public.servers(guild_id) on delete cascade,
  channel_id  text,
  title       text,
  content     text not null,
  sent_at     timestamptz,
  scheduled   timestamptz,
  status      text default 'draft',
  created_at  timestamptz default now()
);

-- ── Portfolio Projects ────────────────────────────────────────────────────────
create table if not exists public.portfolio_projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  image_url   text,
  live_url    text,
  category    text default 'Web App',
  stars       integer default 0,
  featured    boolean default false,
  created_at  timestamptz default now()
);

-- Sample projects
insert into public.portfolio_projects (title, description, category, image_url, stars) values
  ('Discord Bot Dashboard', 'Full-stack control panel for Discord bots', 'Web App', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=220&fit=crop', 42),
  ('No Vanity Brand Kit', 'Complete branding assets and style guide', 'Graphics', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=220&fit=crop', 28),
  ('Verification System', 'TypeScript Discord.js verification bot', 'Open Source', 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=220&fit=crop', 67)
on conflict do nothing;

-- ── Tickets ───────────────────────────────────────────────────────────────────
create table if not exists public.tickets (
  id          uuid primary key default gen_random_uuid(),
  ticket_num  serial,
  user_id     text,
  username    text,
  guild_id    text,
  subject     text not null,
  content     text,
  status      text default 'open',
  priority    text default 'medium',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Stats ─────────────────────────────────────────────────────────────────────
create table if not exists public.verification_events (
  id         uuid primary key default gen_random_uuid(),
  guild_id   text,
  user_id    text,
  event_type text not null,
  created_at timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.users                 enable row level security;
alter table public.servers               enable row level security;
alter table public.verification_configs  enable row level security;
alter table public.embed_templates       enable row level security;
alter table public.announcements         enable row level security;
alter table public.portfolio_projects    enable row level security;
alter table public.tickets               enable row level security;
alter table public.verification_events   enable row level security;

-- Service role bypass (for API routes using service role key)
create policy "service_role_all" on public.users                using (true) with check (true);
create policy "service_role_all" on public.servers              using (true) with check (true);
create policy "service_role_all" on public.verification_configs using (true) with check (true);
create policy "service_role_all" on public.embed_templates      using (true) with check (true);
create policy "service_role_all" on public.announcements        using (true) with check (true);
create policy "service_role_all" on public.portfolio_projects   using (true) with check (true);
create policy "service_role_all" on public.tickets              using (true) with check (true);
create policy "service_role_all" on public.verification_events  using (true) with check (true);
