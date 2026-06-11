-- Stock IV — initial schema
-- Small-hospital multi-staff model: every authenticated user sees the same shared
-- dataset (single tenant). created_by / by_user columns drive audit.

create extension if not exists pgcrypto;

-- ── wards ──────────────────────────────────────────────────────────────────
create table public.wards (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  name            text not null,
  color           text not null default '#1E6FEB',
  default_min     int  not null default 30 check (default_min >= 0),
  default_max     int  not null default 120 check (default_max >= default_min),
  responsible     text,
  note            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users(id) on delete set null
);

-- ── fluid_types (catalog) ──────────────────────────────────────────────────
create table public.fluid_types (
  code            text primary key,
  tag             text not null,
  name            text not null,
  full_name       text,
  size_ml         int,
  category        text not null check (category in ('saline','dextrose','dextrose10','ringer','water')),
  default_min     int  not null default 20,
  default_max     int  not null default 80,
  default_price   numeric(10,2) not null default 18,
  created_at      timestamptz not null default now()
);

-- ── prices (override default_price) ────────────────────────────────────────
create table public.prices (
  fluid_code      text primary key references public.fluid_types(code) on delete cascade,
  price           numeric(10,2) not null check (price >= 0),
  updated_at      timestamptz not null default now(),
  updated_by      uuid references auth.users(id) on delete set null
);

-- ── stock (each lot in each ward) ──────────────────────────────────────────
create table public.stock (
  id              uuid primary key default gen_random_uuid(),
  display_code    text not null,
  fluid_code      text not null references public.fluid_types(code) on delete restrict,
  ward_id         uuid not null references public.wards(id) on delete cascade,
  lot             text not null,
  expiry          date not null,
  qty             int  not null default 0 check (qty >= 0),
  min_qty         int  not null default 30,
  max_qty         int  not null default 120,
  barcode         text,
  note            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users(id) on delete set null
);

create index stock_ward_idx on public.stock (ward_id);
create index stock_fluid_idx on public.stock (fluid_code);
create index stock_expiry_idx on public.stock (expiry);

-- ── movements (in/out/adjust/discard) ──────────────────────────────────────
create table public.movements (
  id              uuid primary key default gen_random_uuid(),
  stock_id        uuid references public.stock(id) on delete set null,
  fluid_code      text not null,
  ward_id         uuid references public.wards(id) on delete set null,
  kind            text not null check (kind in ('in','out','adjust','discard')),
  qty             int  not null,
  note            text,
  occurred_at     timestamptz not null default now(),
  by_user         uuid references auth.users(id) on delete set null
);

create index movements_occurred_idx on public.movements (occurred_at desc);
create index movements_ward_idx on public.movements (ward_id);

-- ── profiles (1:1 with auth.users) ─────────────────────────────────────────
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text not null default '',
  email           text,
  ward_id         uuid references public.wards(id) on delete set null,
  role            text not null default 'staff' check (role in ('admin','staff')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── auto-create profile on sign-up ─────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── touch updated_at ───────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

create trigger wards_touch    before update on public.wards    for each row execute function public.touch_updated_at();
create trigger stock_touch    before update on public.stock    for each row execute function public.touch_updated_at();
create trigger prices_touch   before update on public.prices   for each row execute function public.touch_updated_at();
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.wards       enable row level security;
alter table public.fluid_types enable row level security;
alter table public.prices      enable row level security;
alter table public.stock       enable row level security;
alter table public.movements   enable row level security;
alter table public.profiles    enable row level security;

-- All authenticated users can read every shared table.
create policy auth_read_wards       on public.wards       for select to authenticated using (true);
create policy auth_read_fluids      on public.fluid_types for select to authenticated using (true);
create policy auth_read_prices      on public.prices      for select to authenticated using (true);
create policy auth_read_stock       on public.stock       for select to authenticated using (true);
create policy auth_read_movements   on public.movements   for select to authenticated using (true);

-- All authenticated users can write to shared operational tables. created_by /
-- by_user gives you who-did-what without per-row authorization.
create policy auth_write_wards      on public.wards     for all to authenticated using (true) with check (true);
create policy auth_write_stock      on public.stock     for all to authenticated using (true) with check (true);
create policy auth_write_movements  on public.movements for all to authenticated using (true) with check (true);
create policy auth_write_prices     on public.prices    for all to authenticated using (true) with check (true);

-- fluid_types: read-only for staff; only service-role can modify the catalog.
-- (No write policy → blocked for authenticated.)

-- profiles: read all, self-write only.
create policy auth_read_profiles    on public.profiles for select to authenticated using (true);
create policy self_insert_profile   on public.profiles for insert to authenticated with check (id = auth.uid());
create policy self_update_profile   on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
