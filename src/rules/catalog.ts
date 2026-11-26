import {
  ADMISSION_TRACKS,
  EXTERNAL_SCHOLARSHIPS,
  SEOUL_VOCATIONAL_SCHOOLS,
  type AdmissionTrack,
} from '../data/admissionsData';
import { monthFromDate } from '../data/freshness';
import { GYEONGGI_KLS, GYEONGGI_PROCEDURES } from '../data/gyeonggiData';
import { factsFor } from '../data/multiculturalContent';
import { MULTICULTURAL_TRACKS } from '../data/multiculturalTracks';
import { PROCEDURES } from '../data/procedures';
import { mergePathways, pathwaysFromModules } from './external';
import type { PathwayRecord } from './types';

function sentence(text: string): string {
  const cut = text.split(/(?<=다\.|요\.|\.)\s+/)[0] ?? text;
  return cut.length > 160 ? `${cut.slice(0, 160)}…` : cut;
}

function fromAdmission(track: AdmissionTrack): PathwayRecord {
  const seoul = /서울/.test(`${track.title} ${track.legalBasis}`);
  const foreignParents = track.id === 'univ-foreign-parents';
  const multicultural = track.id === 'univ-multicultural-eq';
  const vocationalGrad = track.id === 'univ-vocational-grad';
  return {
    id: track.id,
    kind: 'admission',
    title: track.title,
    reason: sentence(track.summary),
    yearLabel: track.asOfYear,
    details: [...track.requirements, ...track.requiredDocs],
    sourceUrl: track.referenceUrl || undefined,
    sourceLabel: track.referenceLabel,
    verifiedAt: '2026-11',
    verified: track.verification === 'verified',
    sort: track.level === 'middle' ? 20 : 30,
    when: {
      grades: [track.level],
      regions: seoul ? ['seoul'] : undefined,
      backgrounds: track.eligibleBackgrounds.filter((item) => item !== 'undocumented'),
      koreanLevels: [...track.minKorean],
      koreanNational: multicultural ? 'required' : foreignParents ? 'rejected' : 'any',
      bothParentsForeign: foreignParents ? 'required' : multicultural ? 'rejected' : 'any',
      schoolTypes: vocationalGrad ? ['vocational'] : undefined,
      maxYearsAbroad: track.id === 'hs-special-2c' ? 8 : undefined,
    },
  };
}

function baseCatalog(): PathwayRecord[] {
  const records: PathwayRecord[] = ADMISSION_TRACKS.map(fromAdmission);

  const universities = MULTICULTURAL_TRACKS.filter((track) => track.hasTrack);
  if (universities.length) {
    records.push({
      id: 'multi-univ',
      kind: 'multicultural-univ',
      title: '다문화 전형이 확인된 대학',
      reason: '2027 수시 요강에서 다문화 자녀 전형이 확인된 대학입니다. 한국 국적 학생 기준입니다.',
      yearLabel: '2027학년도',
      details: [],
      verifiedAt: '2026-11',
      verified: true,
      sort: 25,
      detailSource: 'multicultural-univs',
      when: {
        grades: ['high'],
        backgrounds: ['multicultural'],
        koreanNational: 'required',
        bothParentsForeign: 'rejected',
        koreanLevels: ['topik_3_4', 'topik_5_6'],
      },
    });
  }

  const scholarships = [
    ...factsFor('scholarships').map((fact) => fact.name),
    ...EXTERNAL_SCHOLARSHIPS.filter((item) => item.verification === 'verified').map((item) => item.name),
  ];
  if (scholarships.length || factsFor('scholarships').length) {
    const facts = factsFor('scholarships');
    records.push({
      id: 'multi-scholarship',
      kind: 'scholarship',
      title: '다문화 장학금',
      reason: sentence(facts[0]?.text || '확인된 다문화 장학금입니다.'),
      yearLabel: facts[0]?.verifiedAt || '2026',
      details: facts.map((fact) => `${fact.name}. ${sentence(fact.text)}`),
      sourceUrl: facts[0]?.sourceUrl,
      sourceLabel: facts[0]?.name,
      verifiedAt: facts[0]?.verifiedAt,
      verified: true,
      sort: 35,
      when: { backgrounds: ['multicultural'], koreanNational: 'required', bothParentsForeign: 'rejected' },
    });
  }

  for (const step of PROCEDURES) {
    if (!['credential', 'ksl-prep', 'elementary', 'elementary-article19', 'rainbow', 'ksl-online'].includes(step.id)) continue;
    const support = step.id === 'ksl-prep' || step.id === 'rainbow' || step.id === 'ksl-online';
    const grades = step.levels.filter((level): level is 'elementary' | 'middle' | 'high' => level === 'elementary' || level === 'middle' || level === 'high');
    records.push({
      id: step.id,
      kind: support ? 'kls' : 'procedure',
      title: step.title,
      reason: sentence(step.body),
      yearLabel: step.verifiedOn,
      details: [step.body],
      sourceUrl: step.sourceUrl,
      sourceLabel: step.sourceLabel,
      verifiedAt: monthFromDate(step.verifiedOn),
      verified: step.verification === 'verified',
      sort: step.id === 'credential' ? 10 : 15,
      when: {
        grades,
        regions: step.id === 'ksl-prep' || step.id === 'elementary' ? ['seoul'] : step.id === 'credential' ? ['seoul'] : undefined,
        backgrounds: step.id === 'credential' ? ['mid_entry'] : undefined,
        koreanSupport: support ? true : undefined,
      },
    });
  }

  if (SEOUL_VOCATIONAL_SCHOOLS.length) {
    records.push({
      id: 'vocational-schools',
      kind: 'vocational',
      title: '관심 분야 특성화고·마이스터고',
      reason: '고른 관심 분야와 맞는 서울 특성화고·마이스터고입니다. 마이스터고는 대입 특성화고 특별전형 대상이 아닙니다.',
      yearLabel: '2027학년도',
      details: [],
      verifiedAt: '2026-11',
      verified: true,
      sort: 22,
      detailSource: 'vocational-schools',
      when: { grades: ['middle'], regions: ['seoul'], needsInterests: true },
    });
  }

  if (GYEONGGI_KLS.length) {
    const first = GYEONGGI_KLS[0];
    records.push({
      id: 'gyeonggi-kls',
      kind: 'kls',
      title: '경기 한국어학급 (KLS)',
      reason: '경기도 자료에서 전화번호가 확인된 한국어학급입니다.',
      yearLabel: first?.verified_at || '',
      details: [],
      sourceUrl: first?.source_url,
      sourceLabel: first?.name,
      verifiedAt: first?.verified_at,
      verified: true,
      sort: 12,
      detailSource: 'gyeonggi-kls',
      when: { regions: ['gyeonggi'], koreanSupport: true },
    });
  }

  const ggCredential = GYEONGGI_PROCEDURES.filter((row) => !/KLS|한국어/.test(row.name));
  if (ggCredential.length) {
    const first = ggCredential[0];
    records.push({
      id: 'gyeonggi-credential',
      kind: 'procedure',
      title: '경기 학력인정·다문화학력심의',
      reason: sentence(first?.quote || '경기도에서 확인된 학력인정 절차입니다.'),
      yearLabel: first?.verified_at || '',
      details: ggCredential.map((row) => `${row.name}. ${sentence(row.quote)}`),
      sourceUrl: first?.source_url,
      sourceLabel: first?.name,
      verifiedAt: first?.verified_at,
      verified: true,
      sort: 11,
      when: { regions: ['gyeonggi'], backgrounds: ['mid_entry'] },
    });
  }

  const supports = factsFor('school-supports');
  if (supports.length) {
    records.push({
      id: 'multi-school-support',
      kind: 'support',
      title: '학교 지원',
      reason: sentence(supports[0]?.text || '확인된 학교 지원입니다.'),
      yearLabel: supports[0]?.verifiedAt || '',
      details: supports.map((fact) => `${fact.name}. ${sentence(fact.text)}`),
      sourceUrl: supports[0]?.sourceUrl,
      sourceLabel: supports[0]?.name,
      verifiedAt: supports[0]?.verifiedAt,
      verified: true,
      sort: 28,
      when: { backgrounds: ['multicultural'], koreanNational: 'required' },
    });
  }

  return records;
}

const extraModules = import.meta.glob('../data/pathways*.ts', { eager: true }) as Record<string, Record<string, unknown>>;

let cached: PathwayRecord[] | null = null;

export function pathwayCatalog(): PathwayRecord[] {
  if (!cached) cached = mergePathways(baseCatalog(), pathwaysFromModules(extraModules));
  return cached;
}

export function catalogForTest(extra: PathwayRecord[] = []): PathwayRecord[] {
  return mergePathways(baseCatalog(), extra);
}
