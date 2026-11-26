import { PREFS_STORAGE_KEY } from '../privacy/records';

export interface DevicePrefs {
  theme: 'system' | 'light' | 'dark';
  easyKorean: boolean;
  fontScale: 'default' | 'large';
  reduceMotion: boolean;
  teacherMode: boolean;
}

export const DEFAULT_PREFS: DevicePrefs = {
  theme: 'system',
  easyKorean: false,
  fontScale: 'default',
  reduceMotion: false,
  teacherMode: false,
};

export function parsePrefs(raw: unknown): DevicePrefs {
  const value = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const theme = value.theme === 'light' || value.theme === 'dark' || value.theme === 'system' ? value.theme : 'system';
  return {
    theme,
    easyKorean: value.easyKorean === true,
    fontScale: value.fontScale === 'large' ? 'large' : 'default',
    reduceMotion: value.reduceMotion === true,
    teacherMode: value.teacherMode === true,
  };
}

export function readPrefs(): DevicePrefs {
  if (typeof window === 'undefined') return { ...DEFAULT_PREFS };
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    return raw ? parsePrefs(JSON.parse(raw) as unknown) : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function writePrefs(prefs: DevicePrefs): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(parsePrefs(prefs)));
}
