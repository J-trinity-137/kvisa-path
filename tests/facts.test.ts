import { describe, expect, it } from 'vitest';
import { classifyQuestionTopic, schedulePhase } from '../src/data/interactiveModules';
import { filterAdmissionTracks, filterVocationalSchools } from '../src/data/trackFilter';
import { collectFactErrors, isSpecificHttpUrl } from '../src/data/validateFacts';
import { majorsByKnownSchool } from '../src/services/neisClient';
import { SEOUL_VOCATIONAL_SCHOOLS } from '../src/data/admissionsData';

describe('checked facts', () => {
  it('accepts the curated schedules, school codes, and source fields', () => {
    expect(collectFactErrors()).toEqual([]);
  });

  it('rejects a bare homepage', () => {
    expect(isSpecificHttpUrl('https://www.adiga.kr')).toBe(false);
    expect(isSpecificHttpUrl('https://www.sen.go.kr/')).toBe(false);
    expect(isSpecificHttpUrl('https://www.sen.go.kr/user/bbs/BD_selectBbs.do?q_bbsDocNo=1')).toBe(true);
  });

  it('marks past exams closed and keeps the next TOPIK open', () => {
    expect(schedulePhase({ id: 'a', title: '', target: '', dateStr: '2026-11-15', sourceUrl: 'https://example.com/a', sourceLabel: 'a', verifiedOn: '2026-11-26' }, '2026-11-26')).toBe('closed');
    expect(schedulePhase({ id: 'b', title: '', target: '', dateStr: '2026-11-23', endDateStr: '2026-11-24', sourceUrl: 'https://example.com/b', sourceLabel: 'b', verifiedOn: '2026-11-26' }, '2026-11-26')).toBe('closed');
    expect(schedulePhase({ id: 'c', title: '', target: '', dateStr: '2026-11-25', endDateStr: '2026-11-26', sourceUrl: 'https://example.com/c', sourceLabel: 'c', verifiedOn: '2026-11-26' }, '2026-11-26')).toBe('open');
    expect(schedulePhase({ id: 'd', title: '', target: '', dateStr: '2027-01-10', sourceUrl: 'https://example.com/d', sourceLabel: 'd', verifiedOn: '2026-11-26' }, '2026-11-26')).toBe('upcoming');
  });
});

describe('question classification', () => {
  it('treats the GED as equivalent schooling and as unaccepted by the university table', () => {
    const result = classifyQuestionTopic('검정고시 보면 외국인 전형 되나요?');
    expect(result.topicCode).toBe('ged');
    expect(result.guideAnswer).toContain('같은 학력');
    expect(result.guideAnswer).toContain('불인정');
    expect(result.guideAnswer).not.toContain('학교마다');
  });

  it('keeps the Soongsil scholarship on the first semester', () => {
    const result = classifyQuestionTopic('장학금은 어디서 보나요');
    expect(result.topicCode).toBe('scholarship');
    expect(result.guideAnswer).toContain('첫 학기');
  });
});

describe('filters', () => {
  it('hides university tracks from a beginner and keeps the vocational door open', () => {
    const high = filterAdmissionTracks('high', 'both_foreign', 'beginner');
    expect(high.matched).toHaveLength(0);
    expect(high.gaps.length).toBeGreaterThan(0);
    const middle = filterAdmissionTracks('middle', 'undocumented', 'beginner');
    expect(middle.matched.map((track) => track.id)).toEqual(['hs-vocational-future']);
  });

  it('filters schools by field unless the query searches everything', () => {
    const itOnly = filterVocationalSchools('it', '');
    expect(itOnly.every((school) => school.field === 'it')).toBe(true);
    expect(itOnly.some((school) => school.name === '서울로봇고등학교')).toBe(true);
    expect(itOnly.some((school) => school.name === '수도전기공업고등학교')).toBe(true);
    const found = filterVocationalSchools('health', '미림');
    expect(found.map((school) => school.neisCode)).toEqual(['7011569']);
  });
});

describe('NEIS row filter', () => {
  it('keeps only known school codes and does not slice the first eight', () => {
    const allowed = new Set(SEOUL_VOCATIONAL_SCHOOLS.map((school) => school.neisCode));
    const rows = Array.from({ length: 60 }, (_, index) => ({
      SD_SCHUL_CODE: String(8000000 + index),
      DDDEP_NM: `없는학과${index}`,
    }));
    rows.push(
      { SD_SCHUL_CODE: '7010738', DDDEP_NM: '로봇소프트웨어과' },
      { SD_SCHUL_CODE: '7010346', DDDEP_NM: '전기에너지과' },
      { SD_SCHUL_CODE: '7010738', DDDEP_NM: '로봇설계과' },
    );
    const grouped = majorsByKnownSchool(rows, allowed);
    expect(grouped.size).toBe(2);
    expect(grouped.get('7010738')).toEqual(['로봇소프트웨어과', '로봇설계과']);
    expect(grouped.get('7010346')).toEqual(['전기에너지과']);
  });
});
