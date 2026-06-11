# Stock IV — ระบบจัดการสารน้ำ

Production React + TypeScript app for managing IV-fluid inventory across hospital
wards. Vite, React 18, Supabase (Postgres + Auth + RLS).

Features:
- **Dashboard** — live KPIs by ward, alerts, usage histogram from movements
- **Stock list** — search, filter by ward/status, sort, paginate, bulk-delete, edit
- **Add / movement** — multi-step receipt / dispense / new lot with real persistence + audit
- **Expiry alerts** — bucketed by ≤30d / 1–6m / >6m
- **Ward management** — full CRUD with per-ward default min/max + activity feed
- **Pricing & valuation** — editable per-unit prices, value matrix, two layouts
- **Reports** — Excel/PDF/CSV export hooks per range
- **Auth** — email + password via Supabase
- **Responsive** — sidebar drawer on mobile, sticky tabbar, horizontally-scrolling tables
- **Offline mode** — works against localStorage when Supabase env is absent

## Setup

```sh
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from
# https://supabase.com/dashboard/project/_/settings/api

# 3. Apply migrations + seed (one of these):

# Option A — Supabase CLI (recommended):
supabase link --project-ref <your-project-ref>
supabase db push                     # applies supabase/migrations/0001_init.sql
psql "$DATABASE_URL" -f supabase/seed.sql

# Option B — paste into SQL editor:
# Open supabase/migrations/0001_init.sql and supabase/seed.sql in
# https://supabase.com/dashboard/project/_/sql and run them.

# 4. Run
npm run dev
```

## Offline mode

If `VITE_SUPABASE_URL` is empty, the app skips auth and reads/writes
`localStorage`. The first load seeds a 50-row demo dataset. Useful for local
demos, kiosk deployments without internet, or evaluating the UI before
provisioning a Supabase project.

## Schema

See [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).

- `wards` — code, name, color, default thresholds, responsible staff
- `fluid_types` — read-only catalog (saline / dextrose / ringer / water)
- `prices` — per-fluid overrides on top of catalog default_price
- `stock` — every lot in every ward (qty, min, max, expiry, barcode)
- `movements` — audit log (`in` / `out` / `adjust` / `discard`)
- `profiles` — 1:1 with `auth.users`, ward affiliation + role
- `report_schedules` — saved email-report schedules (see below)
- Trigger: new auth user auto-creates a matching profile row

## Scheduled email reports

The Reports page (`รายงาน`) can export CSV / Excel / PDF on demand, and also
schedule a report to be **emailed automatically** (daily / weekly / monthly).
The schedule form persists to `report_schedules`; a Supabase Edge Function
plus `pg_cron` does the actual sending.

To enable automatic sending (one-time setup, in your Supabase project):

```bash
# 1. Apply the migration (creates report_schedules + cron job)
supabase db push      # or paste supabase/migrations/0002_report_schedules.sql in the SQL editor

# 2. Create a free Resend account at https://resend.com, verify a sender,
#    then set the secrets the edge function needs:
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
supabase secrets set REPORT_FROM="Stock IV <reports@yourdomain.com>"

# 3. Deploy the edge function
supabase functions deploy send-report

# 4. Tell pg_cron where the function lives + the service-role key
#    (run once in the SQL editor):
#    alter database postgres set "app.settings.functions_url"   = 'https://<project-ref>.functions.supabase.co';
#    alter database postgres set "app.settings.service_role_key" = '<service-role-key>';
```

The cron job fires daily at 18:00 Asia/Bangkok; the function itself decides
which schedules are *due* (weekly = Monday, monthly = last day of month).
Test it immediately without waiting for cron:

```bash
curl -X POST "https://<project-ref>.functions.supabase.co/send-report" \
  -H "Authorization: Bearer <service-role-key>" \
  -H "Content-Type: application/json" -d '{"force":true}'
```

Until these secrets are set the schedule is still saved and shown in the UI;
only the sending step is inactive (`last_status` records the reason).

## Row-level security

All authenticated users can read every shared table. Mutations are scoped by
`auth.uid()` for `profiles` (self-only) and open to all authenticated users for
the operational tables. `created_by` / `by_user` / `updated_by` give you the
audit trail without per-row authz checks.

To switch to a stricter per-ward authz model, add a `ward_id` filter to each
policy:

```sql
create policy ward_scoped_stock on public.stock for select to authenticated
  using (ward_id = (select ward_id from profiles where id = auth.uid()));
```

## Project layout

```
src/
  App.tsx            -- shell, auth gate, page router, tweaks panel
  main.tsx           -- entry, stylesheet imports
  lib/
    supabase.ts      -- client + isSupabaseConfigured flag
    auth.tsx         -- AuthProvider, useAuth
    data.ts          -- useWards / useStock / useMovements / usePrices hooks
    db.types.ts      -- hand-written row types (keep in sync with migration)
  pages/
    Dashboard.tsx    -- live KPIs + bar/usage charts
    Stock.tsx        -- searchable, sortable, bulk-deletable list
    Add.tsx          -- multi-step receipt/dispense + scanner
    Expiry.tsx       -- bucketed expiry list
    Reports.tsx      -- range/format selector + export
    Value.tsx        -- editable prices + value matrix
    Wards.tsx        -- CRUD + activity feed
    Settings.tsx     -- profile, defaults, sign-out, change password
    Login.tsx        -- sign-in / sign-up
  shell.tsx          -- Sidebar (with mobile drawer), Topbar, MobileTabbar
  ui.tsx             -- Button, Card, Modal, Toast, etc.
  icons.tsx          -- Lucide-style SVG icons
  tweaks.tsx         -- floating dev panel (Claude Design host protocol)
  styles.css         -- base styles (from original design)
  styles-extra.css   -- design tokens + components (from original design)
  styles-app.css     -- auth, ward management, responsive sidebar
supabase/
  migrations/0001_init.sql
  seed.sql
  config.toml
```

## Notes

- **Dates** are stored as ISO `YYYY-MM-DD` in `stock.expiry` (Gregorian). All UI
  shows Buddhist year (พ.ศ.). Conversion lives in `src/lib/data.ts`.
- **Display codes** like `S001` are derived sequentially in `Add.tsx` —
  if you scale beyond a few thousand stock rows, move that into a Postgres
  sequence.
- **No realtime yet.** Mutations refetch the affected resource. If you want
  push updates, swap the hooks to `supabase.channel(...).on('postgres_changes')`.
- **Reports export is a stub** — the buttons fire a toast. Wiring up actual
  Excel/PDF generation needs `xlsx` / `pdfmake`, which I didn't add.
