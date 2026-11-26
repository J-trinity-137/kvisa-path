import { afterEach, describe, expect, it } from 'vitest';
import { CODE_ALPHABET, extractJoinCode, isJoinCode, joinPayload, randomCode } from '../src/accounts/codes';
import {
  DEMO_BANNER,
  accessFor,
  approveEnrollment,
  cleanNickname,
  createAccount,
  createClass,
  emptyDemo,
  grantSimulatedConsent,
  issueGuardianCode,
  joinClass,
  profileFor,
  recordView,
  redeemGuardianCode,
  confirmGuardianLink,
  removeEnrollment,
  unlinkGuardian,
  withProfile,
} from '../src/accounts/model';
import { DEMO_STORAGE_KEY, persistDemo, readDemo, serializeDemo } from '../src/accounts/persist';
import { qrSvgPath } from '../src/accounts/qr';
import { filterRoster, guardianLinks, nextDeadline, onboardingPercent, rosterRows } from '../src/accounts/roster';
import { SAMPLE_CLASS_CODE, loadSample } from '../src/accounts/seed';
import { noteProfileEdit, switchAccount } from '../src/accounts/session';
import { SUPPORTED_LANGS } from '../src/kbridge';
import { accountsCopy } from '../src/i18n/accountsCopy';
import { EMPTY_PROFILE, readProfile, writeProfile, type StudentProfile } from '../src/profile/profile';
import { eligibleTracks } from '../src/rules/evaluate';
import type { EligibleTrack } from '../src/rules/types';

const NOW = '2026-11-26T00:00:00.000Z';
const SOON = '2026-11-26T12:00:00.000Z';
const AFTER_LINK = '2026-11-28T00:00:00.000Z';
const TODAY = new Date(NOW);

function memoryStorage() {
  const mem = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => (mem.has(key) ? mem.get(key)! : null),
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
    key: () => null,
    get length() {
      return mem.size;
    },
  };
  Object.defineProperty(globalThis, 'window', { value: { localStorage }, configurable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: localStorage, configurable: true });
}

function teacherDb() {
  const created = createAccount(emptyDemo(), { nickname: '선생님', role: 'teacher', lang: 'ko', now: NOW });
  if (!created.ok) throw new Error(created.error);
  return created;
}

describe('demo account codes', () => {
  it('uses 31 symbols and 8 characters, without 0, 1, I, L, or O', () => {
    expect(CODE_ALPHABET).toHaveLength(31);
    expect(CODE_ALPHABET).not.toMatch(/[01ILO]/);
    for (let i = 0; i < 40; i += 1) {
      const code = randomCode();
      expect(code).toHaveLength(8);
      expect(isJoinCode(code)).toBe(true);
    }
    expect(extractJoinCode('  fake2345 ')).toBe('FAKE2345');
    expect(extractJoinCode('https://j-trinity-137.github.io/kvisa-path/#/j/FAKE2345')).toBe('FAKE2345');
    expect(extractJoinCode('OOOOOOOO')).toBeNull();
    expect(joinPayload('https://example.test/kvisa-path/', 'FAKE2345')).toBe('https://example.test/kvisa-path/#/j/FAKE2345');
    expect(DEMO_BANNER).toBe('시연 모드 — 이 기기에만 저장');
  });

  it('renders a local QR path with no image host', () => {
    const qr = qrSvgPath('https://example.test/kvisa-path/#/j/FAKE2345');
    expect(qr.size).toBeGreaterThan(20);
    expect(qr.d.startsWith('M')).toBe(true);
    expect(qr.d).not.toMatch(/https?:/i);
  });

  it('has the same account strings in all eight languages', () => {
    const keys = Object.keys(accountsCopy('ko'));
    for (const lang of SUPPORTED_LANGS) {
      const copy = accountsCopy(lang);
      expect(Object.keys(copy)).toEqual(keys);
      expect(copy.unlinked.length).toBeGreaterThan(0);
      expect(copy.unlinked).not.toMatch(/학생이 끊|the student unlinked|student ended/i);
      expect(Object.keys(copy.errors)).toEqual(Object.keys(accountsCopy('ko').errors));
      expect(Object.keys(copy.labels)).toEqual(Object.keys(accountsCopy('ko').labels));
    }
    expect(accountsCopy('ko').unlinked).toBe('연결이 해제됐어요');
  });
});

describe('class approval and guardian links', () => {
  it('keeps a join pending until the class owner approves', () => {
    const teacher = teacherDb();
    const other = createAccount(teacher.db, { nickname: '다른교사', role: 'teacher', lang: 'ko', now: NOW });
    if (!other.ok) throw new Error(other.error);
    const student = createAccount(other.db, { nickname: '하늘', role: 'student', lang: 'ko', now: NOW, ageBand: '14p' });
    if (!student.ok) throw new Error(student.error);
    const room = createClass(student.db, teacher.value.id, '한국어반', NOW);
    if (!room.ok) throw new Error(room.error);
    const joined = joinClass(room.db, student.value.id, room.value.code, SOON);
    if (!joined.ok) throw new Error(joined.error);
    expect(joined.value.status).toBe('pending');
    const blocked = approveEnrollment(joined.db, other.value.id, room.value.id, student.value.id, SOON);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.error).toBe('not_owner');
    const approved = approveEnrollment(joined.db, teacher.value.id, room.value.id, student.value.id, SOON);
    if (!approved.ok) throw new Error(approved.error);
    expect(approved.value.status).toBe('active');
    const again = joinClass(approved.db, student.value.id, room.value.code, SOON);
    expect(again.ok).toBe(false);
  });

  it('blocks an under-14 student until the simulated consent step', () => {
    const teacher = teacherDb();
    const student = createAccount(teacher.db, { nickname: '새싹', role: 'student', lang: 'ko', now: NOW, ageBand: 'u14' });
    if (!student.ok) throw new Error(student.error);
    expect(student.value.consent).toBe('pending');
    const room = createClass(student.db, teacher.value.id, '예시반', NOW);
    if (!room.ok) throw new Error(room.error);
    const blocked = joinClass(room.db, student.value.id, room.value.code, SOON);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.error).toBe('need_consent');
    const agreed = grantSimulatedConsent(room.db, student.value.id);
    if (!agreed.ok) throw new Error(agreed.error);
    const joined = joinClass(agreed.db, student.value.id, room.value.code, SOON);
    if (!joined.ok) throw new Error(joined.error);
    expect(joined.value.status).toBe('pending');
  });

  it('links a guardian with a one-time code, then lets the student unlink', () => {
    let db = emptyDemo();
    const student = createAccount(db, { nickname: '하늘', role: 'student', lang: 'vi', now: NOW, ageBand: '14p' });
    if (!student.ok) throw new Error(student.error);
    db = student.db;
    const guardian = createAccount(db, { nickname: '엄마별명', role: 'guardian', lang: 'vi', now: NOW });
    if (!guardian.ok) throw new Error(guardian.error);
    db = guardian.db;
    const invite = issueGuardianCode(db, student.value.id, NOW);
    if (!invite.ok) throw new Error(invite.error);
    const waiting = redeemGuardianCode(invite.db, guardian.value.id, invite.value.code, SOON);
    if (!waiting.ok) throw new Error(waiting.error);
    expect(waiting.value.status).toBe('pending_student');
    const burned = redeemGuardianCode(waiting.db, guardian.value.id, invite.value.code, SOON);
    expect(burned.ok).toBe(false);
    if (!burned.ok) expect(burned.error).toBe('used');
    expect(accessFor(waiting.db, guardian.value.id, student.value.id)).toBeNull();
    const confirmed = confirmGuardianLink(waiting.db, student.value.id, waiting.value.id);
    if (!confirmed.ok) throw new Error(confirmed.error);
    expect(confirmed.value.status).toBe('active');
    expect(accessFor(confirmed.db, guardian.value.id, student.value.id)).toEqual([]);
    const removed = unlinkGuardian(confirmed.db, student.value.id, confirmed.value.id, SOON);
    if (!removed.ok) throw new Error(removed.error);
    expect(removed.value.status).toBe('revoked');
    expect(JSON.stringify(removed.value)).not.toMatch(/revokedBy|unlinkedBy/);
    expect(accessFor(removed.db, guardian.value.id, student.value.id)).toBeNull();
    const view = guardianLinks(removed.db, guardian.value.id);
    expect(view.active).toEqual([]);
    expect(view.ended).toBe(true);
    expect(view.pending).toEqual([]);
  });

  it('activates an under-14 link after simulated consent and expires old codes', () => {
    const student = createAccount(emptyDemo(), {
      nickname: '새싹',
      role: 'student',
      lang: 'ko',
      now: NOW,
      ageBand: 'u14',
      consent: 'simulated',
      guardianLabel: 'mom',
    });
    if (!student.ok) throw new Error(student.error);
    const guardian = createAccount(student.db, { nickname: '보호자', role: 'guardian', lang: 'ko', now: NOW });
    if (!guardian.ok) throw new Error(guardian.error);
    const invite = issueGuardianCode(guardian.db, student.value.id, NOW);
    if (!invite.ok) throw new Error(invite.error);
    const late = redeemGuardianCode(invite.db, guardian.value.id, invite.value.code, AFTER_LINK);
    expect(late.ok).toBe(false);
    if (!late.ok) expect(late.error).toBe('expired');
    const linked = redeemGuardianCode(invite.db, guardian.value.id, invite.value.code, SOON);
    if (!linked.ok) throw new Error(linked.error);
    expect(linked.value.status).toBe('active');
  });

  it('rejects nicknames that look like a phone, an ID number, or a visa', () => {
    expect(cleanNickname('하늘')).toBe('하늘');
    expect(cleanNickname('01012345678')).toBeNull();
    expect(cleanNickname('F-2학생')).toBeNull();
    expect(cleanNickname('a')).toBeNull();
    const created = createAccount(emptyDemo(), { nickname: 'D-2', role: 'teacher', lang: 'ko', now: NOW });
    expect(created.ok).toBe(false);
  });

  it('removes a student from the roster', () => {
    const teacher = teacherDb();
    const student = createAccount(teacher.db, { nickname: '바다', role: 'student', lang: 'ko', now: NOW, ageBand: '14p' });
    if (!student.ok) throw new Error(student.error);
    const room = createClass(student.db, teacher.value.id, '한국어반', NOW);
    if (!room.ok) throw new Error(room.error);
    const joined = joinClass(room.db, student.value.id, `#/j/${room.value.code}`, SOON);
    if (!joined.ok) throw new Error(joined.error);
    const approved = approveEnrollment(joined.db, teacher.value.id, room.value.id, student.value.id, SOON);
    if (!approved.ok) throw new Error(approved.error);
    const gone = removeEnrollment(approved.db, teacher.value.id, room.value.id, student.value.id);
    if (!gone.ok) throw new Error(gone.error);
    expect(rosterRows(gone.db, room.value.id, TODAY)).toEqual([]);
  });
});

describe('roster rules and the one profile store', () => {
  it('lists eligible tracks, onboarding percent, and the next deadline from the rules engine', () => {
    const teacher = teacherDb();
    const loaded = loadSample(teacher.db, teacher.value.id, NOW);
    if (!loaded.ok) throw new Error(loaded.error);
    expect(loaded.value.code).toBe(SAMPLE_CLASS_CODE);
    expect(loaded.value.sample).toBe(true);
    const rows = rosterRows(loaded.db, loaded.value.id, TODAY);
    expect(rows.map((row) => row.nickname)).toEqual(['예시·구름', '예시·바다', '예시·별', '예시·하늘']);
    const sky = rows.find((row) => row.nickname === '예시·하늘');
    const sea = rows.find((row) => row.nickname === '예시·바다');
    const star = rows.find((row) => row.nickname === '예시·별');
    const cloud = rows.find((row) => row.nickname === '예시·구름');
    if (!sky || !sea || !star || !cloud) throw new Error('missing sample');
    expect(sky.tracks.map((track) => track.id)).toEqual(eligibleTracks(profileFor(loaded.db, sky.studentId)).map((track) => track.id));
    expect(sea.tracks.map((track) => track.id)).toEqual(eligibleTracks(profileFor(loaded.db, sea.studentId)).map((track) => track.id));
    expect(sky.tracks.map((track) => track.id)).toContain('multi-univ');
    expect(sky.tracks.map((track) => track.id)).not.toContain('univ-foreign-parents');
    expect(sea.tracks.map((track) => track.id)).toContain('univ-foreign-parents');
    expect(sea.tracks.map((track) => track.id)).not.toContain('multi-univ');
    expect(star.tracks.map((track) => track.id)).toContain('hs-vocational-future');
    expect(sky.percent).toBe(100);
    expect(onboardingPercent(profileFor(loaded.db, sky.studentId))).toBe(100);
    expect(star.percent).toBeLessThan(100);
    expect(cloud.status).toBe('pending');
    expect(sky.deadline).toEqual(nextDeadline(sky.tracks, TODAY));
    const dated = sky.tracks.some((track) => /\d{4}-\d{2}-\d{2}/.test(track.yearLabel));
    if (dated) expect(sky.deadline && sky.deadline.date >= '2026-11-26').toBe(true);
    const middle = filterRoster(rows, { status: 'all', grade: 'middle', progress: 'all', query: '' });
    expect(middle.map((row) => row.nickname)).toEqual(['예시·별']);
    const searched = filterRoster(rows, { status: 'all', grade: 'all', progress: 'all', query: '다문화' });
    expect(searched.some((row) => row.nickname === '예시·하늘')).toBe(true);
    const again = loadSample(loaded.db, teacher.value.id, NOW);
    if (!again.ok) throw new Error(again.error);
    expect(again.db.accounts.filter((account) => account.id === 'sample-haneul')).toHaveLength(1);
  });

  it('stores a synthetic deadline from track labels', () => {
    const track = {
      id: 'x',
      kind: 'admission',
      title: '예시',
      reason: '예시',
      yearLabel: '2026-01-01 ~ 2027-09-20',
      details: [],
      verified: true,
      sort: 1,
    } satisfies EligibleTrack;
    expect(nextDeadline([track], TODAY)).toEqual({ date: '2027-09-20', title: '예시' });
  });

  it('switches accounts without a second profile schema', () => {
    const student = createAccount(emptyDemo(), { nickname: '하늘', role: 'student', lang: 'ko', now: NOW, ageBand: '14p' });
    if (!student.ok) throw new Error(student.error);
    const other = createAccount(student.db, { nickname: '바다', role: 'student', lang: 'ko', now: NOW, ageBand: '14p' });
    if (!other.ok) throw new Error(other.error);
    const device: StudentProfile = { ...EMPTY_PROFILE, entered: true, grade: 'middle', region: 'busan', skipped: [], homeLanguages: [], interests: [], supportNeeds: [] };
    const first = switchAccount(other.db, device, student.value.id);
    expect(first.db.anonymousProfile?.grade).toBe('middle');
    const edited = noteProfileEdit(first.db, { ...first.profile, grade: 'high', region: 'seoul', studentType: 'domestic_multicultural' });
    const second = switchAccount(edited, profileFor(edited, student.value.id), other.value.id);
    expect(profileFor(second.db, student.value.id).grade).toBe('high');
    expect(second.profile.grade).toBeNull();
    const back = switchAccount(second.db, second.profile, student.value.id);
    expect(back.profile.grade).toBe('high');
    expect(back.profile.region).toBe('seoul');
    const dirty = withProfile(back.db, student.value.id, { ...back.profile, visa: 'D-2' } as StudentProfile);
    expect(JSON.stringify(dirty.profiles[student.value.id])).not.toMatch(/D-2|visa/i);
    memoryStorage();
    writeProfile(back.profile);
    expect(readProfile().grade).toBe('high');
    persistDemo(back.db);
    const round = readDemo();
    expect(round.profiles[student.value.id]?.grade).toBe('high');
    expect(serializeDemo(round)).not.toMatch(/"visa"/);
    expect(window.localStorage.getItem(DEMO_STORAGE_KEY)).toContain('하늘');
  });
});

describe('who viewed', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'localStorage');
  });

  it('records a teacher view for the student and a linked guardian only', () => {
    const teacher = teacherDb();
    const loaded = loadSample(teacher.db, teacher.value.id, NOW);
    if (!loaded.ok) throw new Error(loaded.error);
    const viewed = recordView(loaded.db, teacher.value.id, 'sample-bada', loaded.value.id, SOON);
    if (!viewed.ok) throw new Error(viewed.error);
    expect(accessFor(viewed.db, 'sample-bada', 'sample-bada')?.some((item) => item.actorId === teacher.value.id)).toBe(true);
    expect(accessFor(viewed.db, 'sample-guardian', 'sample-haneul')?.length).toBeGreaterThan(0);
    expect(accessFor(viewed.db, 'sample-guardian', 'sample-bada')).toBeNull();
    const stranger = recordView(viewed.db, 'sample-guardian', 'sample-bada', loaded.value.id, SOON);
    expect(stranger.ok).toBe(false);
  });
});
