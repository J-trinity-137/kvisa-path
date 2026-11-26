import type { BackgroundType } from '../data/admissionsData';
import type { TrackCategory, PathwayRecord as SchemaRow } from '../data/trackSchema';
import { isUnder14, type GradeLevel, type StudentProfile } from '../profile/profile';
import type { WhyCode } from './types';

interface Signals {
  backgrounds: BackgroundType[];
  koreanNational: boolean | null;
  bothParentsForeign: boolean | null;
}

const UNIVERSITY = new Set<TrackCategory>([
  'admission_overview',
  'multicultural',
  'foreign_special',
  'overseas_12yr',
  'overseas_3yr',
  'foreign_school_graduate',
  'international_college',
  'scholarship',
  'junior_college',
  'north_korean_defector',
  'ged',
  'calendar',
  'alternative_school',
  'vocational_entry',
]);

/** One withheld reason, or a pass with the reasons to show on the card. */
export interface RowDecision {
  ok: boolean;
  /** Drop the row without listing it under “why not”. Stay text is not matched to a profile. */
  skip?: boolean;
  reasons: WhyCode[];
  block?: WhyCode;
}

function gradeLock(row: SchemaRow): GradeLevel[] | null {
  if (row.id === 'law-decree-19') return ['elementary'];
  if (row.id === 'law-decree-75') return ['middle'];
  if (row.id === 'law-decree-89-2') return ['high'];
  if (row.id === 'kopo-dasom-high' || row.category === 'alternative_school') return ['middle'];
  if (row.category === 'vocational_entry') return ['middle'];
  if (row.category === 'calendar') return ['high'];
  return null;
}

function isThirdCountryChild(row: SchemaRow): boolean {
  if (row.id === 'ft-nk-third-country-child') return true;
  const text = row.eligibility.textKo;
  if (/없습니다/.test(text)) return false;
  return /제3국에서 출생한 자녀|제3국 출생 북한이탈주민 자녀/.test(text);
}

function positive(profile: StudentProfile, signals: Signals, row: SchemaRow): WhyCode[] {
  const reasons: WhyCode[] = [];
  if (row.category === 'multicultural') {
    reasons.push('korean_national');
    if (signals.bothParentsForeign === false) reasons.push('one_parent_foreign');
    if (profile.bornAbroad === false) reasons.push('domestic_born');
  }
  if (row.category === 'foreign_special' || row.category === 'international_college' || row.category === 'junior_college') {
    if (signals.koreanNational === false) reasons.push('foreign_national');
    if (signals.bothParentsForeign === true) reasons.push('both_parents_foreign');
  }
  if (row.category === 'mid_entry') reasons.push('mid_entry');
  if (row.category === 'foreign_school_graduate') reasons.push('foreign_school');
  if (row.category === 'ged' || profile.schoolType === 'ged') reasons.push('ged');
  if (row.category === 'north_korean_defector') reasons.push('nk_third_country');
  return [...new Set(reasons)];
}

/**
 * Profile gates that matchPathways does not know about.
 * Base nationality and TOPIK gates stay in matchPathways; this adds the representative cases.
 */
export function decideSchemaRow(row: SchemaRow, profile: StudentProfile, signals: Signals): RowDecision {
  if (row.role === 'general_info' || row.category === 'post_graduation_stay') return { ok: false, skip: true, reasons: [] };
  const under14 = isUnder14(profile);
  if (under14 && UNIVERSITY.has(row.category)) return { ok: false, reasons: [], block: 'too_young' };

  const locked = gradeLock(row);
  if (locked && profile.grade && !locked.includes(profile.grade)) {
    return { ok: false, reasons: [], block: under14 ? 'too_young' : 'grade' };
  }

  const ged = profile.schoolType === 'ged';
  const foreignSchool = profile.schoolType === 'foreign_school';
  const mid = signals.backgrounds.includes('mid_entry');
  const nk = profile.nkThirdCountryBorn === true;
  const years = profile.yearsSchoolingAbroad ?? 0;
  const category = row.category;

  if (category === 'north_korean_defector') {
    if (!nk || !isThirdCountryChild(row)) return { ok: false, reasons: [], block: 'not_nk' };
  }

  if (nk && (category === 'multicultural' || category === 'foreign_special' || category === 'overseas_3yr' || category === 'overseas_12yr')) {
    return { ok: false, reasons: [], block: 'not_nk' };
  }

  if (category === 'mid_entry') {
    const elementaryEnrollment = under14 && row.id === 'law-decree-19';
    const foreignChild = signals.koreanNational === false;
    if (!mid && !foreignChild && !elementaryEnrollment) return { ok: false, reasons: [], block: 'not_mid_entry' };
  }

  if (category === 'foreign_school_graduate' && !foreignSchool) {
    const gedPath = ged && row.eligibility.gedAccepted === true;
    if (!gedPath) return { ok: false, reasons: [], block: 'not_foreign_school' };
  }

  if (category === 'ged' && !ged) return { ok: false, reasons: [], block: 'not_ged' };

  if (ged && row.eligibility.gedAccepted === false) return { ok: false, reasons: [], block: 'ged_rejected' };
  if (
    ged &&
    row.eligibility.gedAccepted == null &&
    (category === 'foreign_special' || category === 'overseas_12yr' || category === 'overseas_3yr' || category === 'junior_college' || category === 'scholarship' || category === 'international_college')
  ) {
    return { ok: false, reasons: [], block: 'ged_unconfirmed' };
  }

  if (foreignSchool && !ged && row.eligibility.gedAccepted === true && /검정고시/.test(row.eligibility.textKo)) {
    return { ok: false, reasons: [], block: 'not_ged' };
  }
  const domesticSchoolBar = `${row.eligibility.textKo} ${row.eligibility.ageResidency?.noteKo ?? ''}`;
  if (foreignSchool && /외국인학교/.test(domesticSchoolBar) && /(지원할 수 없|지원 불가|불인정)/.test(domesticSchoolBar)) {
    return { ok: false, reasons: [], block: 'foreign_school_excluded' };
  }
  if (foreignSchool && row.eligibility.foreignHighSchoolExcluded) return { ok: false, reasons: [], block: 'foreign_school_excluded' };
  if (foreignSchool && (category === 'foreign_special' || category === 'overseas_12yr' || category === 'overseas_3yr' || category === 'international_college' || category === 'junior_college')) {
    return { ok: false, reasons: [], block: 'foreign_school_excluded' };
  }

  if (category === 'overseas_12yr' && years < 12) return { ok: false, reasons: [], block: 'overseas_years_short' };
  if (category === 'overseas_3yr') {
    const coversTwelve = row.alsoCovers.includes('overseas_12yr') && years >= 12;
    if (!coversTwelve) {
      if (signals.bothParentsForeign === true && signals.koreanNational !== true) return { ok: false, reasons: [], block: 'not_overseas_posting' };
      if (signals.koreanNational !== true || years < 3) return { ok: false, reasons: [], block: 'overseas_years_short' };
    }
  }

  if (category === 'admission_overview' && row.alsoCovers.length > 0) {
    const foreignOverview = row.alsoCovers.every((item) =>
      item === 'foreign_special' || item === 'overseas_12yr' || item === 'overseas_3yr' || item === 'north_korean_defector',
    );
    const matchesForeign = signals.bothParentsForeign === true && signals.koreanNational === false;
    if (foreignOverview && !matchesForeign) return { ok: false, reasons: [], block: 'not_this_overview' };
  }

  return { ok: true, reasons: positive(profile, signals, row) };
}

export function blockForCatalog(profile: StudentProfile, id: string, kind: string): WhyCode | null {
  if (profile.nkThirdCountryBorn) {
    if (kind === 'admission' || kind === 'multicultural-univ' || kind === 'scholarship') return 'not_nk';
  }
  if (profile.schoolType === 'ged' && (id === 'univ-foreign-parents' || kind === 'multicultural-univ')) {
    return id === 'univ-foreign-parents' ? 'ged_rejected' : null;
  }
  if (profile.schoolType === 'foreign_school' && (id.startsWith('univ-') || kind === 'multicultural-univ')) return 'foreign_school_excluded';
  if (isUnder14(profile) && (id.startsWith('univ-') || id.startsWith('hs-') || kind === 'multicultural-univ' || kind === 'vocational' || kind === 'scholarship')) return 'too_young';
  if (profile.grade && profile.grade !== 'high' && (kind === 'scholarship' || kind === 'multicultural-univ' || id.startsWith('univ-'))) {
    return 'grade';
  }
  return null;
}

export function catalogReasons(profile: StudentProfile, signals: Signals, id: string): WhyCode[] {
  const reasons: WhyCode[] = [];
  if (id === 'univ-multicultural-eq' || id === 'multi-univ' || id === 'multi-scholarship' || id === 'multi-school-support') {
    reasons.push('korean_national');
    if (signals.bothParentsForeign === false) reasons.push('one_parent_foreign');
    if (profile.bornAbroad === false) reasons.push('domestic_born');
  }
  if (id === 'univ-foreign-parents') reasons.push('foreign_national', 'both_parents_foreign');
  if (id === 'gyeonggi-credential' || id === 'credential' || id === 'hs-special-2c') reasons.push('mid_entry');
  if (profile.schoolType === 'ged') reasons.push('ged');
  return [...new Set(reasons)];
}

export function referenceKindOf(row: { role?: string; cycleYear?: number | null; guideBasis?: string }): 'guide' | 'closed' | undefined {
  if (row.guideBasis === '2027_guide') return 'guide';
  if (row.role === 'closed_reference' || row.cycleYear === 2027) return 'closed';
  return undefined;
}
