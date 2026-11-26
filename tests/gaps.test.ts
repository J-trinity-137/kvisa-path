import { describe, expect, it } from 'vitest';
import { classifyQuestionTopic } from '../src/data/interactiveModules';
import { DDAY_SCHEDULES } from '../src/data/interactiveModules';
import { PROCEDURES } from '../src/data/procedures';
import { UNIVERSITY_SCHOLARSHIP_RULES, UNIVERSITY_TOPIK_TABLE } from '../src/data/admissionsData';
import { SEOUL_SUPPORT_CENTERS } from '../src/data/centersData';
import { optionsForVisa, VISA_CODES, VISA_PATHS } from '../src/data/visaPaths';
import { partTimeHours } from '../src/data/workHours';
import { scheduleToIcs } from '../src/share/ics';
import { isSpecificHttpUrl } from '../src/data/validateFacts';
import { UNIVERSITY_IDS } from '../src/data/admissionsData';
import { TABLE_COPY_LANGS, counselorHeads, universityCell } from '../src/i18n/tableCopy';

const REQUIRED = ['F-1', 'F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'D-2', 'D-4', 'D-10', 'E-7', 'E-9', 'H-2', 'G-1', 'undocumented'] as const;

describe('visa picker', () => {
  it('covers every requested status and keeps unverified rows explicit', () => {
    expect(VISA_CODES).toEqual([...REQUIRED]);
    for (const code of REQUIRED) {
      const path = VISA_PATHS.find((item) => item.code === code);
      expect(path, code).toBeTruthy();
      expect(path?.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (path?.verification === 'verified') {
        expect(isSpecificHttpUrl(path.sourceUrl)).toBe(true);
      } else {
        expect(path?.unverifiedReason?.length).toBeGreaterThan(0);
      }
    }
  });

  it('shows a real option to an undocumented high-school student', () => {
    const options = optionsForVisa('undocumented', 'high');
    expect(options.map((item) => item.code)).toContain('undocumented');
    expect(options.length).toBeGreaterThan(0);
    expect(options[0]?.summary).toContain('2028-03-31');
  });
});

describe('new checked facts', () => {
  it('uses the HiKorea-cited hour table for a bachelor student', () => {
    expect(partTimeHours('d2_ba_12', true, false)).toMatchObject({ hours: 25, weekendUnlimited: true, verified: true });
    expect(partTimeHours('d2_ba_12', true, true)).toMatchObject({ hours: 30, verified: true });
    expect(partTimeHours('d2_ba_12', false, true)).toMatchObject({ hours: 10, weekendUnlimited: false });
    expect(partTimeHours('d4_lang', true, false)).toMatchObject({ hours: 20, weekendUnlimited: false, verified: true });
    expect(partTimeHours('high_school', true, false).verified).toBe(false);
    expect(partTimeHours('d2_kcore', true, false).verified).toBe(false);
  });

  it('classifies questions written in the supported languages', () => {
    expect(classifyQuestionTopic('Tôi cần học bổng').topicCode).toBe('scholarship');
    expect(classifyQuestionTopic('我想打工').topicCode).toBe('part_time');
    expect(classifyQuestionTopic('Нужна виза').topicCode).toBe('visa_status');
    expect(classifyQuestionTopic('апостил хаана авах вэ').topicCode).toBe('documents');
  });

  it('builds a calendar file without personal data', () => {
    const ics = scheduleToIcs(DDAY_SCHEDULES[0]!);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).not.toContain('F-2');
    expect(ics).not.toContain('미등록');
  });

  it('links procedures and newly checked center phones to a page', () => {
    expect(PROCEDURES.every((item) => isSpecificHttpUrl(item.sourceUrl))).toBe(true);
    const checked = SEOUL_SUPPORT_CENTERS.filter((center) => center.phoneVerifiedOn);
    expect(checked.length).toBeGreaterThan(6);
    expect(checked.every((center) => center.phoneSourceUrl && isSpecificHttpUrl(center.phoneSourceUrl))).toBe(true);
    expect(SEOUL_SUPPORT_CENTERS).toHaveLength(25);
    expect(SEOUL_SUPPORT_CENTERS.every((center) => Object.keys(center.interpreters).length === 0)).toBe(true);
    expect(SEOUL_SUPPORT_CENTERS.filter((center) => center.phone === '')).toHaveLength(0);
    expect(SEOUL_SUPPORT_CENTERS.every((center) => center.phoneVerifiedOn && isSpecificHttpUrl(center.phoneSourceUrl ?? ''))).toBe(true);
    const skku = UNIVERSITY_TOPIK_TABLE.find((row) => row.id === 'skku');
    expect(skku?.topik6).toBe('100%');
    expect(skku?.topik5).toBe('50%');
    expect(skku?.gedAccepted).toBe('불인정');
    expect(skku?.note).toContain('해외 고교');
    expect(UNIVERSITY_SCHOLARSHIP_RULES.skku.verification).toBe('verified');
    expect(isSpecificHttpUrl(UNIVERSITY_SCHOLARSHIP_RULES.skku.sourceUrl)).toBe(true);
  });

  it('translates counselor headers and university notes', () => {
    for (const lang of TABLE_COPY_LANGS) {
      expect(counselorHeads(lang).term).not.toBe(counselorHeads('ko').term);
      for (const id of UNIVERSITY_IDS) {
        const cell = universityCell(lang, id);
        expect(cell.note.length).toBeGreaterThan(8);
        expect(cell.ged.length).toBeGreaterThan(0);
        expect(cell.track.length).toBeGreaterThan(0);
      }
    }
  });
});
