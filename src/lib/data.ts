// Data layer. Every hook prefers Supabase when configured and falls back to
// localStorage when it isn't — same return shape both ways, so pages don't care.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, requireSupabase } from './supabase';
import type { FluidType, Movement, Price, StockRow, Ward } from './db.types';
import { useAuth } from './auth';

// ── localStorage keys ──────────────────────────────────────────────────────
const LS_WARDS = 'iv_wards_v2';
const LS_STOCK = 'iv_stock_v2';
const LS_MOVEMENTS = 'iv_movements_v2';
const LS_PRICES = 'iv_prices_v2';
const LS_CATALOG = 'iv_fluids_v2';

// ── fallback seed (kept tiny — mirrors supabase/seed.sql) ─────────────────
const SEED_WARDS: Ward[] = [
  fakeWard('semi-sx', 'SEMI SX', '#1E6FEB', 40, 150),
  fakeWard('surg-male', 'ศัลยกรรมชาย', '#22C5B0', 30, 120),
  fakeWard('surg-female', 'ศัลยกรรมหญิง', '#0EA5E9', 30, 120),
  fakeWard('icu', 'ICU', '#6366F1', 35, 130),
  fakeWard('er', 'ER', '#F59E0B', 40, 140),
];

const SEED_FLUIDS: FluidType[] = [
  ft('NSS100', 'NSS', 'NSS', '0.9% Sodium Chloride', 100, 'saline', 20, 80, 12),
  ft('NSS500', 'NSS', 'NSS', '0.9% Sodium Chloride', 500, 'saline', 24, 100, 15),
  ft('NSS1000', 'NSS', 'NSS', '0.9% Sodium Chloride', 1000, 'saline', 40, 150, 18),
  ft('NSS045-1000', '½NS', '0.45% NaCl', '0.45% Sodium Chloride', 1000, 'saline', 15, 60, 18),
  ft('D5W100', 'D5W', 'D-5-W', '5% Dextrose in Water', 100, 'dextrose', 15, 60, 14),
  ft('D5W200', 'D5W', 'D-5-W', '5% Dextrose in Water', 200, 'dextrose', 15, 60, 16),
  ft('D5W250', 'D5W', 'D-5-W', '5% Dextrose in Water', 250, 'dextrose', 15, 60, 18),
  ft('D5W500', 'D5W', 'D-5-W', '5% Dextrose in Water', 500, 'dextrose', 20, 80, 20),
  ft('D5W1000', 'D5W', 'D-5-W', '5% Dextrose in Water', 1000, 'dextrose', 40, 150, 22),
  ft('D5S1000', 'D5S', 'D-5-S', '5% Dextrose in NSS', 1000, 'dextrose', 20, 80, 24),
  ft('D5N2-500', 'D5N2', 'D-5-N/2', '5% Dextrose in ½ NSS', 500, 'dextrose', 15, 60, 26),
  ft('D5N2-1000', 'D5N2', 'D-5-N/2', '5% Dextrose in ½ NSS', 1000, 'dextrose', 20, 80, 30),
  ft('D5N3-500', 'D5N3', 'D-5-N/3', '5% Dextrose in ⅓ NSS', 500, 'dextrose', 15, 60, 28),
  ft('D10S1000', 'D10S', 'D-10-S', '10% Dextrose in NSS', 1000, 'dextrose10', 15, 60, 26),
  ft('D10N2-1000', 'D10N2', 'D-10-N/2', '10% Dextrose in ½ NSS', 1000, 'dextrose10', 15, 60, 28),
  ft('RAC1000', 'RAC', 'Acetate Ringer', 'Acetated Ringer', 1000, 'ringer', 20, 80, 30),
  ft('ACETAR5-1000', 'ACE5', 'ACETAR-5', 'Acetar-5 (Dextrose+Acetate)', 1000, 'ringer', 15, 60, 34),
  ft('RL1000', 'RL', 'Lactate Ringer', 'Lactated Ringer', 1000, 'ringer', 30, 120, 28),
  ft('NSSI1000', 'NSS-I', 'NSS irrigate', 'NSS (irrigation)', 1000, 'water', 15, 60, 16),
  ft('SWI1000', 'SWI', 'Sterile Water irrigate', 'Sterile Water (irrigation)', 1000, 'water', 15, 60, 16),
  ft('SWI1000IV', 'SWI-IV', 'Sterile Water IV', 'Sterile Water for Injection', 1000, 'water', 15, 60, 18),
  ft('SWI100', 'SWI', 'Sterile Water', 'Sterile Water for Injection', 100, 'water', 10, 40, 12),
];

function fakeWard(code: string, name: string, color: string, min: number, max: number): Ward {
  const now = new Date().toISOString();
  return {
    id: code,
    code,
    name,
    color,
    default_min: min,
    default_max: max,
    responsible: null,
    note: null,
    created_at: now,
    updated_at: now,
    created_by: null,
  };
}

function ft(
  code: string,
  tag: string,
  name: string,
  full: string,
  size: number,
  cat: FluidType['category'],
  min: number,
  max: number,
  price: number,
): FluidType {
  return {
    code,
    tag,
    name,
    full_name: full,
    size_ml: size,
    category: cat,
    default_min: min,
    default_max: max,
    default_price: price,
    created_at: new Date().toISOString(),
  };
}

// ── localStorage helpers ───────────────────────────────────────────────────
function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function lsSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Ensure localStorage is seeded the first time we touch it.
function ensureSeed() {
  if (!localStorage.getItem(LS_WARDS)) lsSet(LS_WARDS, SEED_WARDS);
  if (!localStorage.getItem(LS_CATALOG)) lsSet(LS_CATALOG, SEED_FLUIDS);
  if (!localStorage.getItem(LS_STOCK)) lsSet(LS_STOCK, makeDemoStock());
  if (!localStorage.getItem(LS_MOVEMENTS)) lsSet(LS_MOVEMENTS, []);
}

function makeDemoStock(): StockRow[] {
  const wards = ['semi-sx', 'surg-male', 'surg-female', 'icu', 'er'];
  const codes = ['NSS1000', 'RL1000', 'D5W1000', 'D5N2-1000', 'RL1000', 'NSS500', 'D5W500'];
  let seed = 20240605;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const today = new Date(2025, 5, 5);
  const now = new Date().toISOString();
  const out: StockRow[] = [];
  for (let i = 0; i < 50; i++) {
    const ward = wards[Math.floor(rnd() * wards.length)];
    const code = codes[Math.floor(rnd() * codes.length)];
    const qty = 10 + Math.floor(rnd() * 141);
    const exp = new Date(today);
    exp.setDate(exp.getDate() + Math.floor(rnd() * 560) - 40);
    const beY = exp.getFullYear() + 543;
    const expiry = `${beY}-${String(exp.getMonth() + 1).padStart(2, '0')}-${String(exp.getDate()).padStart(2, '0')}`;
    const lot = 'L' + (beY % 100) + (1 + Math.floor(rnd() * 9)) + String.fromCharCode(65 + Math.floor(rnd() * 26));
    out.push({
      id: uuid(),
      display_code: 'S' + String(i + 1).padStart(3, '0'),
      fluid_code: code,
      ward_id: ward,
      lot,
      expiry,
      qty,
      min_qty: 30,
      max_qty: 120,
      barcode: null,
      note: null,
      created_at: now,
      updated_at: now,
      created_by: null,
    });
  }
  return out;
}

// ── hook factory: generic loader + invalidate ──────────────────────────────
type Loader<T> = () => Promise<T>;

function useResource<T>(loader: Loader<T>, initial: T, deps: unknown[] = []) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await loader();
      setData(next);
    } catch (e: any) {
      setError(e?.message ?? 'load failed');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh, setData };
}

// ── wards ──────────────────────────────────────────────────────────────────
async function loadWards(): Promise<Ward[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await requireSupabase().from('wards').select('*').order('name');
    if (error) throw error;
    return data ?? [];
  }
  ensureSeed();
  return lsGet<Ward[]>(LS_WARDS, []);
}

export function useWards() {
  const r = useResource(loadWards, [] as Ward[]);

  const create = useCallback(
    async (input: { code: string; name: string; color?: string; default_min?: number; default_max?: number; responsible?: string | null; note?: string | null }) => {
      if (isSupabaseConfigured) {
        const { data, error } = await requireSupabase().from('wards').insert(input).select().single();
        if (error) throw error;
        await r.refresh();
        return data;
      }
      const all = lsGet<Ward[]>(LS_WARDS, []);
      const now = new Date().toISOString();
      const row: Ward = {
        id: uuid(),
        code: input.code,
        name: input.name,
        color: input.color ?? '#1E6FEB',
        default_min: input.default_min ?? 30,
        default_max: input.default_max ?? 120,
        responsible: input.responsible ?? null,
        note: input.note ?? null,
        created_at: now,
        updated_at: now,
        created_by: null,
      };
      lsSet(LS_WARDS, [...all, row]);
      await r.refresh();
      return row;
    },
    [r],
  );

  const update = useCallback(
    async (id: string, patch: Partial<Ward>) => {
      if (isSupabaseConfigured) {
        const { error } = await requireSupabase().from('wards').update(patch).eq('id', id);
        if (error) throw error;
      } else {
        const all = lsGet<Ward[]>(LS_WARDS, []);
        const next = all.map((w) => (w.id === id ? { ...w, ...patch, updated_at: new Date().toISOString() } : w));
        lsSet(LS_WARDS, next);
      }
      await r.refresh();
    },
    [r],
  );

  const remove = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured) {
        const { error } = await requireSupabase().from('wards').delete().eq('id', id);
        if (error) throw error;
      } else {
        const all = lsGet<Ward[]>(LS_WARDS, []);
        lsSet(
          LS_WARDS,
          all.filter((w) => w.id !== id),
        );
      }
      await r.refresh();
    },
    [r],
  );

  return { wards: r.data, loading: r.loading, error: r.error, refresh: r.refresh, create, update, remove };
}

// ── fluid catalog ──────────────────────────────────────────────────────────
async function loadFluids(): Promise<FluidType[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await requireSupabase().from('fluid_types').select('*').order('code');
    if (error) throw error;
    return data ?? [];
  }
  ensureSeed();
  return lsGet<FluidType[]>(LS_CATALOG, []);
}

export function useFluids() {
  const r = useResource(loadFluids, [] as FluidType[]);
  return { fluids: r.data, loading: r.loading, error: r.error, refresh: r.refresh };
}

// ── stock ──────────────────────────────────────────────────────────────────
async function loadStockRows(): Promise<StockRow[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await requireSupabase().from('stock').select('*').order('expiry');
    if (error) throw error;
    return data ?? [];
  }
  ensureSeed();
  return lsGet<StockRow[]>(LS_STOCK, []);
}

export type StockInput = Omit<StockRow, 'id' | 'created_at' | 'updated_at' | 'created_by'>;

export function useStock() {
  const { user } = useAuth();
  const r = useResource(loadStockRows, [] as StockRow[]);

  const create = useCallback(
    async (input: StockInput) => {
      if (isSupabaseConfigured) {
        const { data, error } = await requireSupabase()
          .from('stock')
          .insert({ ...input, created_by: user?.id ?? null })
          .select()
          .single();
        if (error) throw error;
        await r.refresh();
        return data as StockRow;
      }
      const all = lsGet<StockRow[]>(LS_STOCK, []);
      const now = new Date().toISOString();
      const row: StockRow = {
        ...input,
        id: uuid(),
        created_at: now,
        updated_at: now,
        created_by: user?.id ?? null,
      };
      lsSet(LS_STOCK, [...all, row]);
      await r.refresh();
      return row;
    },
    [r, user],
  );

  const update = useCallback(
    async (id: string, patch: Partial<StockRow>) => {
      if (isSupabaseConfigured) {
        const { error } = await requireSupabase().from('stock').update(patch).eq('id', id);
        if (error) throw error;
      } else {
        const all = lsGet<StockRow[]>(LS_STOCK, []);
        const next = all.map((s) => (s.id === id ? { ...s, ...patch, updated_at: new Date().toISOString() } : s));
        lsSet(LS_STOCK, next);
      }
      await r.refresh();
    },
    [r],
  );

  const remove = useCallback(
    async (ids: string[]) => {
      if (isSupabaseConfigured) {
        const { error } = await requireSupabase().from('stock').delete().in('id', ids);
        if (error) throw error;
      } else {
        const all = lsGet<StockRow[]>(LS_STOCK, []);
        lsSet(
          LS_STOCK,
          all.filter((s) => !ids.includes(s.id)),
        );
      }
      await r.refresh();
    },
    [r],
  );

  // Adjust qty in place — used by movement creation.
  const adjustQty = useCallback(
    async (id: string, delta: number) => {
      const all = await loadStockRows();
      const row = all.find((s) => s.id === id);
      if (!row) return;
      const nextQty = Math.max(0, row.qty + delta);
      await update(id, { qty: nextQty });
    },
    [update],
  );

  return { stock: r.data, loading: r.loading, error: r.error, refresh: r.refresh, create, update, remove, adjustQty };
}

// ── movements ──────────────────────────────────────────────────────────────
async function loadMovements(limit = 200): Promise<Movement[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await requireSupabase()
      .from('movements')
      .select('*')
      .order('occurred_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  }
  ensureSeed();
  return lsGet<Movement[]>(LS_MOVEMENTS, []);
}

export type MovementInput = Omit<Movement, 'id' | 'occurred_at' | 'by_user'>;

export function useMovements(limit = 200) {
  const { user } = useAuth();
  const r = useResource(() => loadMovements(limit), [] as Movement[], [limit]);

  const create = useCallback(
    async (input: MovementInput) => {
      if (isSupabaseConfigured) {
        const { data, error } = await requireSupabase()
          .from('movements')
          .insert({ ...input, by_user: user?.id ?? null })
          .select()
          .single();
        if (error) throw error;
        await r.refresh();
        return data as Movement;
      }
      const all = lsGet<Movement[]>(LS_MOVEMENTS, []);
      const row: Movement = {
        ...input,
        id: uuid(),
        occurred_at: new Date().toISOString(),
        by_user: user?.id ?? null,
      };
      lsSet(LS_MOVEMENTS, [row, ...all]);
      await r.refresh();
      return row;
    },
    [r, user],
  );

  return { movements: r.data, loading: r.loading, error: r.error, refresh: r.refresh, create };
}

// ── prices ────────────────────────────────────────────────────────────────
async function loadPrices(): Promise<Price[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await requireSupabase().from('prices').select('*');
    if (error) throw error;
    return data ?? [];
  }
  return lsGet<Price[]>(LS_PRICES, []);
}

export function usePrices() {
  const { user } = useAuth();
  const r = useResource(loadPrices, [] as Price[]);
  const { fluids } = useFluids();

  // Build a code → price map merging the default catalog price with overrides.
  const priceMap = useMemo<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    fluids.forEach((f) => (m[f.code] = Number(f.default_price)));
    r.data.forEach((p) => (m[p.fluid_code] = Number(p.price)));
    return m;
  }, [fluids, r.data]);

  const setOne = useCallback(
    async (fluid_code: string, price: number) => {
      if (isSupabaseConfigured) {
        const { error } = await requireSupabase()
          .from('prices')
          .upsert({ fluid_code, price, updated_by: user?.id ?? null }, { onConflict: 'fluid_code' });
        if (error) throw error;
      } else {
        const all = lsGet<Price[]>(LS_PRICES, []);
        const without = all.filter((p) => p.fluid_code !== fluid_code);
        without.push({
          fluid_code,
          price,
          updated_at: new Date().toISOString(),
          updated_by: user?.id ?? null,
        });
        lsSet(LS_PRICES, without);
      }
      await r.refresh();
    },
    [r, user],
  );

  const reset = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { error } = await requireSupabase().from('prices').delete().gte('price', 0);
      if (error) throw error;
    } else {
      lsSet(LS_PRICES, []);
    }
    await r.refresh();
  }, [r]);

  return { prices: r.data, priceMap, loading: r.loading, error: r.error, refresh: r.refresh, setOne, reset };
}

// ── formatters (kept here so callers don't re-import data.ts vs. lib/data.ts) ──
export const fmtNum = (n: number) => n.toLocaleString('en-US');
export const fmtBaht = (n: number) => '฿' + Math.round(n).toLocaleString('en-US');
export const fmtBaht2 = (n: number) =>
  '฿' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const daysFromToday = (be: string): number => {
  const [y, m, d] = be.split('-').map(Number);
  const ad = new Date(y - 543, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((ad.getTime() - today.getTime()) / 86400000);
};
export const formatThaiDate = (be: string): string => {
  const [y, m, d] = be.split('-').map(Number);
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${d} ${months[m - 1]} ${y}`;
};

// Convert a JS Date to a "พ.ศ.-MM-DD" string (Buddhist year).
export const toBeDate = (jsDate: Date): string => {
  const beY = jsDate.getFullYear() + 543;
  return `${beY}-${String(jsDate.getMonth() + 1).padStart(2, '0')}-${String(jsDate.getDate()).padStart(2, '0')}`;
};

// ── static display metadata (not stored in DB) ────────────────────────────
export const FLUID_CATS = {
  saline: { label: 'กลุ่มเกลือ (Saline)', color: '#1E6FEB' },
  dextrose: { label: 'กลุ่มน้ำตาล (Dextrose)', color: '#16A34A' },
  dextrose10: { label: 'น้ำตาลเข้มข้น (D-10)', color: '#0E7C5A' },
  ringer: { label: 'กลุ่มริงเกอร์ (Ringer)', color: '#E0518D' },
  water: { label: 'น้ำกลั่น/ล้างแผล (SWI)', color: '#64748B' },
} as const;

export type FluidCategory = keyof typeof FLUID_CATS;
