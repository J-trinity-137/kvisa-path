import { TARGET_2028_WINDOWS, type PathwayRecord as SchemaPathway, type PathwayWindow, type Quota, type TrackCategory } from '../data/trackSchema';
import type { StudentProfile } from '../profile/profile';
import { catalogTrack, failureRows, isAdmissionCategory, ruleFailures, schemaTrack, type ReasonRow, type RuleFailure } from '../rules/reasons';
import type { PathwayKind } from '../rules/types';

export type WindowKind = 'guide2027' | 'cycle2028' | 'dated' | 'none';

export interface CompareWindow {
  kind: WindowKind;
  ranges: readonly PathwayWindow[];
  fallback: string | null;
}

export interface CompareColumn {
  id: string;
  name: string;
  university: string | null;
  category: TrackCategory | null;
  catalogKind: PathwayKind | null;
  quota: Quota | null;
  nationality: SchemaPathway['eligibility']['nationality'] | null;
  bothParentsForeign: boolean;
  multiculturalChild: boolean;
  topikMin: number | null;
  topikNone: boolean;
  topikNote: string | null;
  school: string;
  window: CompareWindow;
  sourceUrl: string | null;
  verifiedAt: string | null;
  fails: RuleFailure[];
  failRows: ReasonRow[];
}

function windowFor(row: SchemaPathway): CompareWindow {
  if (row.guideBasis === '2027_guide') {
    return { kind: 'guide2027', ranges: row.windows, fallback: null };
  }
  if (row.windows.length) return { kind: 'dated', ranges: row.windows, fallback: null };
  if (row.cycleYear === 2028 && row.role === 'current_target' && (isAdmissionCategory(row.category) || row.category === 'admission_overview')) {
    return { kind: 'cycle2028', ranges: [TARGET_2028_WINDOWS.susi, TARGET_2028_WINDOWS.jeongsi], fallback: null };
  }
  return { kind: 'none', ranges: [], fallback: row.cycleYear ? String(row.cycleYear) : null };
}

function fromSchema(row: SchemaPathway, profile: StudentProfile, today?: string): CompareColumn {
  const fails = ruleFailures(profile, row.id, today);
  const stay = row.eligibility.ageResidency?.noteKo;
  const school = [row.eligibility.textKo, stay].filter((line): line is string => Boolean(line)).join(' ');
  return {
    id: row.id,
    name: row.track ? `${row.university ?? row.name} · ${row.track}` : row.name,
    university: row.university,
    category: row.category,
    catalogKind: null,
    quota: row.quota,
    nationality: row.eligibility.nationality,
    bothParentsForeign: row.eligibility.bothParentsForeign === true,
    multiculturalChild: row.eligibility.multiculturalFamilyChild === true,
    topikMin: row.language?.topikMin ?? null,
    topikNone: row.language?.noMinimum === true,
    topikNote: row.language?.noteKo ?? null,
    school,
    window: windowFor(row),
    sourceUrl: row.url,
    verifiedAt: row.verifiedAt,
    fails,
    failRows: failureRows(fails),
  };
}

function fromCatalog(id: string, profile: StudentProfile, today?: string): CompareColumn | null {
  const row = catalogTrack(id);
  if (!row) return null;
  const fails = ruleFailures(profile, id, today);
  const levels = row.when.koreanLevels ?? [];
  const topikMin = levels.includes('topik_5_6') && !levels.includes('topik_3_4') && !levels.includes('beginner') ? 5 : levels.includes('topik_3_4') ? 3 : null;
  return {
    id: row.id,
    name: row.title,
    university: null,
    category: null,
    catalogKind: row.kind,
    quota: null,
    nationality: row.when.koreanNational === 'required' ? 'korean_citizen_only' : row.when.koreanNational === 'rejected' ? 'foreign_national_student' : 'unspecified',
    bothParentsForeign: row.when.bothParentsForeign === 'required',
    multiculturalChild: row.when.backgrounds?.includes('multicultural') === true,
    topikMin,
    topikNone: levels.includes('beginner'),
    topikNote: null,
    school: row.reason,
    window: { kind: 'none', ranges: [], fallback: row.yearLabel || null },
    sourceUrl: row.sourceUrl ?? null,
    verifiedAt: row.verifiedAt ?? null,
    fails,
    failRows: failureRows(fails),
  };
}

export function compareColumns(ids: readonly string[], profile: StudentProfile, today?: string): CompareColumn[] {
  const columns: CompareColumn[] = [];
  for (const id of ids) {
    const schema = schemaTrack(id);
    const column = schema ? fromSchema(schema, profile, today) : fromCatalog(id, profile, today);
    if (column) columns.push(column);
  }
  return columns;
}

export function rowHasFail(columns: readonly CompareColumn[], row: ReasonRow): boolean {
  return columns.some((column) => column.failRows.includes(row));
}
