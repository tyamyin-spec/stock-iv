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
- Trigger: new auth user auto-creates a matching profile row

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
