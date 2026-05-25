-- Stock IV — users table for login
-- Reference for the ACTUAL table in Supabase.
--
-- Schema in use:  id, username, password_hash, role, created_at
-- Passwords are stored as PLAIN TEXT (column is named `password_hash` for
-- historical reasons but holds the raw password, e.g. '1234').
-- Login (client-side) matches by `username` (trimmed, case-insensitive) and
-- compares the password as plain text (a SHA-256 hash is also accepted).

create table if not exists users (
  id          bigint generated always as identity primary key,
  username    text unique not null,
  password_hash text not null,        -- plain-text password (e.g. '1234')
  role        text default 'RN',       -- RN | TN | PN | NA | admin
  created_at  timestamptz default now()
);

-- The table already exists in production; this column add is idempotent.
alter table users add column if not exists role text default 'RN';

-- Row Level Security: allow the browser (anon key) to READ only.
-- Do NOT add anon insert/update/delete policies — writes must stay blocked.
alter table users enable row level security;

drop policy if exists "anon can read users for login" on users;
create policy "anon can read users for login"
  on users for select
  to anon
  using (true);

-- ---------------------------------------------------------------------------
-- Maintenance: reset every password to '1234' and assign positions.
-- (Safe to re-run.)
-- ---------------------------------------------------------------------------
update users set password_hash = '1234';

update users set role = 'RN';
update users set role = 'TN' where username = 'วราภรณ์';
update users set role = 'PN' where username in ('มณธิการณ์', 'พิชัยบัญชา');
update users set role = 'NA' where username in ('อุมาภรณ์', 'อัมรา', 'วันเพ็ญ');
