/** Seoul now. Gyeonggi stays empty until a later verified update. */
export type RegionId = 'seoul' | 'gyeonggi';

export const REGIONS: readonly RegionId[] = ['seoul', 'gyeonggi'];

export interface DatedEntry {
  id: string;
  kind: string;
  verifiedAt?: string;
  sourceUrl?: string;
  region?: RegionId;
}

export function monthFromDate(value: string | undefined): string {
  if (!value) return '';
  const match = /^(\d{4}-\d{2})/.exec(value);
  return match?.[1] ?? '';
}

export function stampVerifiedAt<T extends { verifiedOn?: string; phoneVerifiedOn?: string; verifiedAt?: string }>(
  items: readonly T[],
  field: 'verifiedOn' | 'phoneVerifiedOn' = 'verifiedOn',
): void {
  for (const item of items) {
    const raw = field === 'phoneVerifiedOn' ? item.phoneVerifiedOn : item.verifiedOn;
    const month = monthFromDate(raw);
    if (month) item.verifiedAt = month;
  }
}

/** True when the check month is more than 12 months before today. */
export function isOlderThanYear(verifiedAt: string, today = new Date()): boolean {
  const match = /^(\d{4})-(\d{2})$/.exec(verifiedAt);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const age = (today.getFullYear() - year) * 12 + (today.getMonth() + 1 - month);
  return age > 12;
}
