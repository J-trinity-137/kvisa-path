import type { RegionId } from './freshness';

/** Device preference, same idea as language. Never copied into events. */
export const REGION_KEY = 'kvisa-path.region';

export function readRegion(): RegionId {
  if (typeof window === 'undefined') return 'seoul';
  return window.localStorage.getItem(REGION_KEY) === 'gyeonggi' ? 'gyeonggi' : 'seoul';
}

export function writeRegion(value: RegionId): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REGION_KEY, value);
}
