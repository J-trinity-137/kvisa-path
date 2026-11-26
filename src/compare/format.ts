import { planCopy, reasonText } from '../i18n/planCopy';
import { PATHWAYS_2028_COPY } from '../i18n/pathways2028Copy';
import type { SupportedLangCode } from '../kbridge';
import type { RuleFailure } from '../rules/reasons';
import type { CompareColumn } from './model';

export function categoryText(lang: SupportedLangCode, column: CompareColumn): string {
  const copy = planCopy(lang);
  if (column.category) return PATHWAYS_2028_COPY[lang].groups[column.category];
  if (column.catalogKind) return copy.kinds[column.catalogKind];
  return copy.none;
}

export function quotaText(lang: SupportedLangCode, column: CompareColumn): string {
  const copy = planCopy(lang);
  const paths = PATHWAYS_2028_COPY[lang];
  const quota = column.quota;
  if (!quota) return copy.none;
  const parts: string[] = [];
  if (quota.seats != null) parts.push(`${quota.seats}${paths.seatUnit}`);
  if (quota.kind === 'unrestricted') parts.push(paths.unrestricted);
  if (quota.kind === 'out_of_quota') parts.push(paths.outOfQuota);
  if (quota.kind === 'in_quota') parts.push(paths.inQuota);
  if (quota.kind === 'cap_percent' && quota.capPercent != null) parts.push(`${quota.capPercent}${paths.capSuffix}`);
  if (quota.noteKo) parts.push(quota.noteKo);
  return parts.length ? parts.join(' · ') : copy.none;
}

export function nationalityText(lang: SupportedLangCode, column: CompareColumn): string {
  const copy = planCopy(lang);
  const paths = PATHWAYS_2028_COPY[lang];
  const parts: string[] = [];
  if (column.nationality === 'korean_citizen_only') parts.push(paths.koreanOnly);
  else if (column.nationality === 'both_parents_and_student_foreign' || column.bothParentsForeign) parts.push(paths.bothParents);
  else if (column.nationality === 'foreign_national_student') parts.push(copy.foreignStudent);
  else if (column.nationality === 'either') parts.push(copy.either);
  else parts.push(copy.notStated);
  if (column.bothParentsForeign && column.nationality !== 'both_parents_and_student_foreign') parts.push(paths.bothParents);
  if (column.multiculturalChild) parts.push(copy.multicultural);
  return [...new Set(parts)].join(' ');
}

export function topikText(lang: SupportedLangCode, column: CompareColumn): string {
  const copy = planCopy(lang);
  const paths = PATHWAYS_2028_COPY[lang];
  if (column.topikNone) return paths.topikNone;
  if (column.topikMin != null) return paths.topikAtLeast.replace('{level}', String(column.topikMin));
  if (column.topikNote) return column.topikNote;
  return copy.notStated;
}

export function windowText(lang: SupportedLangCode, column: CompareColumn): string {
  const copy = planCopy(lang);
  const ranges = column.window.ranges.map((range) => (range.start === range.end ? range.start : `${range.start} – ${range.end}`)).join('\n');
  if (column.window.kind === 'guide2027') {
    return ranges ? `${copy.guide2027}\n${ranges}` : copy.guide2027;
  }
  if (column.window.kind === 'cycle2028') return ranges ? `${copy.window2028}\n${ranges}` : copy.window2028;
  if (column.window.kind === 'dated') return ranges || copy.none;
  return column.window.fallback ?? copy.none;
}

export function failText(lang: SupportedLangCode, fails: readonly RuleFailure[], row: RuleFailure['row']): string | null {
  const copy = planCopy(lang);
  const matched = fails.filter((fail) => fail.row === row);
  if (!matched.length) return null;
  return matched.map((fail) => reasonText(copy, fail.code, fail.need)).join(' ');
}
