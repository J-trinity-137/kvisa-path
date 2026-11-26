import { REGION_IDS, type RegionId } from './freshness';

/** Device preference, same idea as language. Never copied into events. */
export const REGION_KEY = 'kvisa-path.region';

export function isRegionId(value: string | null | undefined): value is RegionId {
  return value != null && (REGION_IDS as readonly string[]).includes(value);
}

export function readRegion(): RegionId {
  if (typeof window === 'undefined') return 'seoul';
  const stored = window.localStorage.getItem(REGION_KEY);
  return isRegionId(stored) ? stored : 'seoul';
}

export function writeRegion(value: RegionId): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REGION_KEY, value);
}
