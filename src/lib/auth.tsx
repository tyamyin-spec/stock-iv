// AuthProvider — wraps Supabase session and exposes sign-in / sign-up / sign-out.
// In offline mode (no Supabase configured) it pretends the user is signed in as
// a local "dev" user so the rest of the app works for demos.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './supabase';

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
};

const Ctx = createContext<AuthState | null>(null);

// Staff log in with just their name (Thai or English) — no email needed.
// Supabase Auth requires an email and rejects non-ASCII, so we deterministically
// hash the (normalised) name into an ASCII address like "u1a2b3c4d5e6f7a8b@stock-iv.local".
// Same name in → same address, so login matches sign-up. The real typed name is
// stored separately as the profile display_name. A typed real email is used as-is.
// Must be a normal TLD — Supabase rejects reserved domains like ".local".
const USERNAME_DOMAIN = 'stock-iv.com';
export const usernameToEmail = (username: string): string => {
  const raw = username.trim();
  if (raw.includes('@')) return raw.toLowerCase(); // backward-compat: real email
  const norm = raw.toLowerCase().replace(/\s+/g, ' ');
  const fnv = (seed: number): string => {
    let h = seed >>> 0;
    for (let i = 0; i < norm.length; i++) {
      h ^= norm.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  };
  // Two seeds → 64-bit-ish digest, collision-safe for a small staff list.
  return `u${fnv(0x811c9dc5)}${fnv(0x1b873593)}@${USERNAME_DOMAIN}`;
};

// Supabase enforces a 6-char minimum password. To let staff use short (3+) PINs,
// we deterministically pad anything shorter than 6 with a constant filler — applied
// identically at sign-up and login so they always match. Passwords already ≥6 are
// untouched. (Effective strength = the chars actually typed; fine for internal use.)
const PW_FILLER = 'iv2580';
export const toAuthPassword = (p: string): string =>
  p.length >= 6 ? p : p + PW_FILLER.slice(0, 6 - p.length);

// Offline-mode sentinel user. Keeps page guards passing without auth wired up.
const DEV_USER = {
  id: 'dev-local',
  email: 'dev@localhost',
  user_metadata: { display_name: 'Local Dev' },
} as unknown as User;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(isSupabaseConfigured ? null : DEV_USER);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password: toAuthPassword(password) });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.signUp({
      email,
      password: toAuthPassword(password),
      options: { data: { display_name: displayName } },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.updateUser({ password: toAuthPassword(newPassword) });
    return { error: error?.message ?? null };
  }, []);

  return (
    <Ctx.Provider value={{ user, session, loading, signIn, signUp, signOut, updatePassword }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
