// App-wide preferences (currently just the expiry-warning window). Persisted to
// localStorage and shared via context so every page reacts to changes live.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const LS_SETTINGS = 'iv_settings_v1';

// Default: warn when a lot is within 7 months (210 days) of expiry.
export const DEFAULT_EXPIRY_WARN_DAYS = 210;

// Choices offered in Settings (value in days).
export const EXPIRY_WARN_OPTIONS: { days: number; label: string }[] = [
  { days: 30, label: '1 เดือน (30 วัน)' },
  { days: 90, label: '3 เดือน (90 วัน)' },
  { days: 180, label: '6 เดือน (180 วัน)' },
  { days: 210, label: '7 เดือน (210 วัน)' },
  { days: 365, label: '1 ปี (365 วัน)' },
];

type Settings = { expiryWarnDays: number };
type SettingsState = Settings & { setExpiryWarnDays: (d: number) => void };

const Ctx = createContext<SettingsState | null>(null);

function load(): Settings {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (raw) return { expiryWarnDays: DEFAULT_EXPIRY_WARN_DAYS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {}
  return { expiryWarnDays: DEFAULT_EXPIRY_WARN_DAYS };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const setExpiryWarnDays = useCallback((d: number) => setSettings((s) => ({ ...s, expiryWarnDays: d })), []);

  return <Ctx.Provider value={{ ...settings, setExpiryWarnDays }}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}

// Round a day-count to a friendly "N เดือน" / "N ปี" label.
export function warnWindowLabel(days: number): string {
  if (days % 365 === 0) return `${days / 365} ปี`;
  const months = Math.round(days / 30);
  return `${months} เดือน`;
}
