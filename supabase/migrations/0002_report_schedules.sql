-- Stock IV — scheduled email reports
-- Stores per-schedule config. A pg_cron job invokes the `send-report` edge
-- function on a fixed cadence; the function reads enabled rows and emails them.

create table public.report_schedules (
  id            uuid primary key default gen_random_uuid(),
  recipients    text not null,                         -- comma-separated emails
  frequency     text not null default 'daily'
                  check (frequency in ('daily','weekly','monthly')),
  report_id     text not null default 'r1'
                  check (report_id in ('r1','r2','r3','r4','r5','r6')),
  format        text not null default 'csv'
                  check (format in ('csv','xlsx')),    -- pdf can't be generated headless without a renderer
  ward          text not null default 'all',
  enabled       boolean not null default true,
  last_sent_at  timestamptz,
  last_status   text,                                  -- 'ok' | error message
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references auth.users(id) on delete set null
);

create index report_schedules_enabled_idx on public.report_schedules (enabled);

create trigger report_schedules_touch
  before update on public.report_schedules
  for each row execute function public.touch_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.report_schedules enable row level security;

create policy auth_read_schedules  on public.report_schedules
  for select to authenticated using (true);
create policy auth_write_schedules on public.report_schedules
  for all to authenticated using (true) with check (true);

-- ── scheduled invocation (pg_cron + pg_net) ──────────────────────────────────
-- These run inside the Supabase project. Safe to no-op if the extensions or
-- settings aren't present yet (e.g. local dev) — wrap in a DO block.
do $$
begin
  -- Enable required extensions (available on Supabase managed Postgres).
  begin
    create extension if not exists pg_cron;
    create extension if not exists pg_net;
  exception when others then
    raise notice 'pg_cron/pg_net not available here — skipping cron setup (set it up in the Supabase dashboard).';
    return;
  end;

  -- Daily at 18:00 Asia/Bangkok = 11:00 UTC. The edge function itself decides
  -- which schedules are due (daily / weekly Monday / monthly end-of-month).
  perform cron.schedule(
    'send-report-daily',
    '0 11 * * *',
    $cron$
    select net.http_post(
      url     := current_setting('app.settings.functions_url', true) || '/send-report',
      headers := jsonb_build_object(
        'Content-Type','application/json',
        'Authorization','Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body    := '{}'::jsonb
    );
    $cron$
  );
exception when others then
  raise notice 'cron.schedule skipped: %', sqlerrm;
end $$;
