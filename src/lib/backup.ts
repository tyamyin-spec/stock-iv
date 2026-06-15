// Data backup — gather every table into one JSON snapshot the user can download
// and keep. Works against Supabase when configured, else localStorage.

import { isSupabaseConfigured, requireSupabase } from './supabase';

const TABLES = ['wards', 'fluid_types', 'prices', 'stock', 'movements', 'report_schedules', 'profiles'] as const;

const LS_KEYS: Record<string, string> = {
  wards: 'iv_wards_v2',
  stock: 'iv_stock_v2',
  movements: 'iv_movements_v2',
  prices: 'iv_prices_v2',
  fluid_types: 'iv_fluids_v2',
  report_schedules: 'iv_report_schedules_v1',
};

export type Backup = {
  app: 'stock-iv';
  version: number;
  exported_at: string;
  source: 'supabase' | 'local';
  tables: Record<string, unknown[]>;
};

export async function gatherBackup(): Promise<Backup> {
  const tables: Record<string, unknown[]> = {};
  if (isSupabaseConfigured) {
    const sb = requireSupabase();
    for (const t of TABLES) {
      const { data, error } = await (sb.from(t) as any).select('*');
      if (error) throw error;
      tables[t] = data ?? [];
    }
  } else {
    for (const t of TABLES) {
      try {
        tables[t] = JSON.parse(localStorage.getItem(LS_KEYS[t] ?? '') || '[]');
      } catch {
        tables[t] = [];
      }
    }
  }
  return {
    app: 'stock-iv',
    version: 1,
    exported_at: new Date().toISOString(),
    source: isSupabaseConfigured ? 'supabase' : 'local',
    tables,
  };
}

export function backupCounts(b: Backup): string {
  return Object.entries(b.tables)
    .filter(([, v]) => v.length > 0)
    .map(([k, v]) => `${k} ${v.length}`)
    .join(' · ');
}

// Trigger the send-backup edge function to email a snapshot now (uses the
// caller's session). The function gathers data server-side with the service role.
export async function emailBackup(to: string): Promise<{ ok: boolean; error?: string; rows?: number }> {
  if (!isSupabaseConfigured) throw new Error('ต้องเชื่อมต่อ Supabase ก่อน (โหมดออฟไลน์ส่งไม่ได้)');
  const { data, error } = await requireSupabase().functions.invoke('send-backup', { body: { to } });
  if (error) throw error;
  return data as { ok: boolean; error?: string; rows?: number };
}

export async function downloadBackup(): Promise<Backup> {
  const data = await gatherBackup();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `stock-iv-backup_${data.exported_at.slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return data;
}
