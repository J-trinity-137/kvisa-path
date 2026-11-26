import {
  ADMISSION_TRACKS,
  EXTERNAL_SCHOLARSHIPS,
  SEOUL_VOCATIONAL_SCHOOLS,
  UNIVERSITY_GED_RULES,
  UNIVERSITY_IDS,
  UNIVERSITY_SCHOLARSHIP_RULES,
  UNIVERSITY_TOPIK_TABLE,
  type SourcedClaim,
} from './admissionsData';
import { DDAY_SCHEDULES } from './interactiveModules';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isSpecificHttpUrl(url: string): boolean {
  if (!url.startsWith('https://')) return false;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  const path = parsed.pathname.replace(/\/+$/, '');
  return path.length > 0 || parsed.search.length > 0;
}

function checkClaim(errors: string[], label: string, claim: SourcedClaim): void {
  if (!claim.applicableTerm.trim()) errors.push(`${label}: applicableTerm is empty`);
  if (!DATE_RE.test(claim.verifiedOn)) errors.push(`${label}: verifiedOn must be YYYY-MM-DD`);
  if (claim.verification === 'verified') {
    if (!isSpecificHttpUrl(claim.sourceUrl)) errors.push(`${label}: verified sourceUrl must be a specific https page`);
  } else if (!claim.unverifiedReason?.trim()) {
    errors.push(`${label}: unverified claims need a reason`);
  } else if (claim.sourceUrl && !isSpecificHttpUrl(claim.sourceUrl)) {
    errors.push(`${label}: sourceUrl is not a specific page`);
  }
}

const EXPECTED_CODES: Record<string, string> = {
  성암국제무역고등학교: '7010837',
  서울관광고등학교: '7010739',
  서울컨벤션고등학교: '7011213',
  세명컴퓨터고등학교: '7010537',
  서울영상고등학교: '7010795',
  이화여자대학교병설미디어고등학교: '7010747',
  단국대학교부속소프트웨어고등학교: '7011489',
  대동세무고등학교: '7010833',
  대진디자인고등학교: '7010740',
  서울의료보건고등학교: '7011486',
  미림마이스터고등학교: '7011569',
  서울로봇고등학교: '7010738',
  수도전기공업고등학교: '7010346',
};

export function collectFactErrors(): string[] {
  const errors: string[] = [];
  const codes = SEOUL_VOCATIONAL_SCHOOLS.map((school) => school.neisCode);
  if (new Set(codes).size !== codes.length) errors.push('duplicate school codes');
  for (const school of SEOUL_VOCATIONAL_SCHOOLS) {
    if (!/^\d{7}$/.test(school.neisCode)) errors.push(`bad code shape: ${school.name}`);
    if (school.name.includes('·')) errors.push(`merged school row: ${school.name}`);
    if (EXPECTED_CODES[school.name] !== school.neisCode) errors.push(`unexpected code for ${school.name}`);
    if (!isSpecificHttpUrl(school.sourceUrl) || !school.sourceUrl.includes(school.neisCode)) {
      errors.push(`school sourceUrl: ${school.name}`);
    }
    if (!DATE_RE.test(school.verifiedOn)) errors.push(`school verifiedOn: ${school.name}`);
    if (!school.majorsApplicableTerm.trim() || !isSpecificHttpUrl(school.majorsSourceUrl)) {
      errors.push(`school majors source: ${school.name}`);
    }
  }
  for (const [name, code] of Object.entries(EXPECTED_CODES)) {
    if (!SEOUL_VOCATIONAL_SCHOOLS.some((school) => school.name === name && school.neisCode === code)) {
      errors.push(`missing school ${name}`);
    }
  }
  if (SEOUL_VOCATIONAL_SCHOOLS.some((school) => school.neisCode === '7010536')) {
    errors.push('7010536 is 선린인터넷고등학교 and must not be used for 로봇고/수도전기공고');
  }

  for (const schedule of DDAY_SCHEDULES) {
    if (!DATE_RE.test(schedule.dateStr) || !DATE_RE.test(schedule.verifiedOn)) errors.push(`schedule date: ${schedule.id}`);
    if (schedule.endDateStr && !DATE_RE.test(schedule.endDateStr)) errors.push(`schedule end: ${schedule.id}`);
    if (!isSpecificHttpUrl(schedule.sourceUrl)) errors.push(`schedule source: ${schedule.id}`);
    if (!schedule.sourceLabel.trim()) errors.push(`schedule label: ${schedule.id}`);
  }
  const byId = Object.fromEntries(DDAY_SCHEDULES.map((schedule) => [schedule.id, schedule]));
  if (byId['sched-topik-109']?.dateStr !== '2026-11-15') errors.push('109th TOPIK date');
  if (byId['sched-topik-110']?.dateStr !== '2027-01-10') errors.push('110th TOPIK date');
  if (byId['sched-voc-apply']?.dateStr !== '2026-11-23' || byId['sched-voc-apply']?.endDateStr !== '2026-11-24') {
    errors.push('vocational application window');
  }
  if (byId['sched-susi-2028']?.dateStr !== '2027-09-20') errors.push('2028 susi start');
  if (DDAY_SCHEDULES.some((schedule) => schedule.dateStr === '2027-01-17' || schedule.dateStr === '2027-09-08')) {
    errors.push('retired wrong schedule date is still present');
  }

  const tableIds = UNIVERSITY_TOPIK_TABLE.map((row) => row.id);
  if (tableIds.length !== UNIVERSITY_IDS.length || tableIds.some((id) => !UNIVERSITY_IDS.includes(id as (typeof UNIVERSITY_IDS)[number]))) {
    errors.push('university id list does not match the table');
  }
  for (const row of UNIVERSITY_TOPIK_TABLE) {
    if (row.gedAccepted !== '불인정' && row.gedAccepted !== '원칙 불인정(정규고)' && row.gedAccepted !== '미확인') {
      errors.push(`ged label: ${row.id}`);
    }
    const id = row.id as (typeof UNIVERSITY_IDS)[number];
    checkClaim(errors, `ged ${row.id}`, UNIVERSITY_GED_RULES[id]);
    checkClaim(errors, `scholarship ${row.id}`, UNIVERSITY_SCHOLARSHIP_RULES[id]);
  }
  if (!UNIVERSITY_SCHOLARSHIP_RULES.ssu.applicableTerm.includes('첫 학기')) {
    errors.push('Soongsil scholarship term');
  }
  if (UNIVERSITY_GED_RULES.ssu.verification !== 'verified') errors.push('Soongsil GED should be verified');

  for (const rule of EXTERNAL_SCHOLARSHIPS) {
    checkClaim(errors, `external ${rule.id}`, rule);
  }

  for (const track of ADMISSION_TRACKS) {
    if (track.referenceUrl && !isSpecificHttpUrl(track.referenceUrl)) errors.push(`track referenceUrl: ${track.id}`);
    if (track.verification === 'unverified' && !track.unverifiedReason?.trim()) errors.push(`track reason: ${track.id}`);
    if (track.verification === 'verified' && !isSpecificHttpUrl(track.referenceUrl)) errors.push(`verified track url: ${track.id}`);
  }

  return errors;
}
