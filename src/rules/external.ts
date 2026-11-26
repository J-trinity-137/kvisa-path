import type { BackgroundType, KoreanLevel } from '../data/admissionsData';
import type { RegionId } from '../data/freshness';
import type { GradeLevel } from '../profile/profile';
import type { PathwayKind, PathwayRecord, PathwayWhen } from './types';

const GRADES = new Set<GradeLevel>(['elementary', 'middle', 'high']);
const REGIONS = new Set<RegionId>(['seoul', 'gyeonggi']);
const BACKGROUNDS = new Set<BackgroundType>(['both_foreign', 'multicultural', 'mid_entry', 'undocumented']);
const LEVELS = new Set<KoreanLevel>(['beginner', 'topik_3_4', 'topik_5_6']);
const KINDS = new Set<PathwayKind>(['admission', 'multicultural-univ', 'scholarship', 'procedure', 'vocational', 'kls', 'support']);

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function strList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => str(item)).filter(Boolean);
}

function filterSet<T extends string>(value: unknown, allowed: Set<T>): T[] | undefined {
  const list = strList(value).filter((item): item is T => allowed.has(item as T));
  return list.length ? list : undefined;
}

/**
 * Accepts the loose row shape a pathways2028 module is expected to export.
 * Unknown rows are ignored. Visa/residency fields are not read.
 */
export function normalizePathway(row: unknown): PathwayRecord | null {
  if (!row || typeof row !== 'object') return null;
  const value = row as Record<string, unknown>;
  const id = str(value.id);
  const title = str(value.title);
  if (!id || !title) return null;
  const whenRaw = value.when && typeof value.when === 'object' ? (value.when as Record<string, unknown>) : {};
  const grades = filterSet(value.grades ?? value.levels ?? whenRaw.grades, GRADES);
  const level = str(value.level);
  const when: PathwayWhen = {
    grades: grades ?? (GRADES.has(level as GradeLevel) ? [level as GradeLevel] : undefined),
    regions: filterSet(value.regions ?? whenRaw.regions, REGIONS),
    backgrounds: filterSet(value.backgrounds ?? value.eligibleBackgrounds ?? whenRaw.backgrounds, BACKGROUNDS)?.filter(
      (item) => item !== 'undocumented',
    ),
    koreanLevels: filterSet(value.minKorean ?? value.koreanLevels ?? whenRaw.koreanLevels, LEVELS),
  };
  if (value.koreanNationalOnly === true || whenRaw.koreanNational === 'required') when.koreanNational = 'required';
  if (value.requiresBothParentsForeign === true || whenRaw.bothParentsForeign === 'required') when.bothParentsForeign = 'required';
  if (whenRaw.koreanNational === 'rejected') when.koreanNational = 'rejected';
  if (whenRaw.bothParentsForeign === 'rejected') when.bothParentsForeign = 'rejected';
  const kindRaw = str(value.kind);
  return {
    id,
    kind: KINDS.has(kindRaw as PathwayKind) ? (kindRaw as PathwayKind) : 'admission',
    title,
    reason: str(value.reason) || str(value.summary) || title,
    yearLabel: str(value.yearLabel) || str(value.asOfYear) || str(value.verifiedOn),
    details: strList(value.details ?? value.requirements),
    sourceUrl: str(value.sourceUrl) || undefined,
    sourceLabel: str(value.sourceLabel) || undefined,
    verifiedAt: str(value.verifiedAt) || str(value.verifiedOn) || undefined,
    verified: value.verification === 'verified' || value.verified === true,
    when,
    sort: typeof value.sort === 'number' ? value.sort : 40,
  };
}

export function pathwaysFromModules(modules: Record<string, Record<string, unknown>>): PathwayRecord[] {
  const out: PathwayRecord[] = [];
  for (const mod of Object.values(modules)) {
    for (const value of Object.values(mod)) {
      const rows = Array.isArray(value) ? value : [];
      for (const row of rows) {
        const pathway = normalizePathway(row);
        if (pathway) out.push(pathway);
      }
    }
  }
  return out;
}

export function mergePathways(base: readonly PathwayRecord[], extra: readonly PathwayRecord[]): PathwayRecord[] {
  const map = new Map(base.map((row) => [row.id, row]));
  for (const row of extra) map.set(row.id, row);
  return [...map.values()];
}
