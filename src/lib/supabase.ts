// Supabase client. Tolerates missing env: when not configured, callers fall back
// to localStorage so the app runs offline for demos.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './db.types';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured: boolean = Boolean(url && key);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url as string, key as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

// Helper: throw a useful error when a remote-only operation is attempted offline.
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}
