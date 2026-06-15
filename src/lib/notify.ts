// Trigger the line-alert edge function to broadcast a stock alert to the LINE
// Official Account's friends now (uses the caller's session).

import { isSupabaseConfigured, requireSupabase } from './supabase';

export async function sendLineTest(): Promise<{ ok: boolean; error?: string; low?: number; expiring?: number; skipped?: string }> {
  if (!isSupabaseConfigured) throw new Error('ต้องเชื่อมต่อ Supabase ก่อน (โหมดออฟไลน์ส่งไม่ได้)');
  const { data, error } = await requireSupabase().functions.invoke('line-alert', { body: { force: true } });
  if (error) throw error;
  return data as { ok: boolean; error?: string; low?: number; expiring?: number };
}
