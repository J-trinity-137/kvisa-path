import type { StudentProfile } from '../profile/profile';
import { EMPTY_PROFILE, parseProfile } from '../profile/profile';
import { accountById, createAccount, emptyDemo, withProfile, type DemoDb, type DemoResult } from './model';
import type { DemoClass } from './model';

const SAMPLE_CLASS_ID = 'sample-class';
export const SAMPLE_CLASS_CODE = 'FAKE2345';

function profile(partial: Partial<StudentProfile>): StudentProfile {
  return parseProfile({
    ...EMPTY_PROFILE,
    skipped: [],
    homeLanguages: [],
    interests: [],
    supportNeeds: [],
    ...partial,
  });
}

/** Fictional class. Nicknames start with 예시· and the code is FAKE2345. */
export function loadSample(db: DemoDb, teacherId: string, now: string): DemoResult<DemoClass> {
  const teacher = accountById(db, teacherId);
  if (!teacher || teacher.role !== 'teacher') return { ok: false, db, error: 'forbidden' };
  const existing = db.classes.find((room) => room.sample);
  if (existing) {
    if (existing.ownerId !== teacherId) return { ok: false, db, error: 'already' };
    return { ok: true, db, value: existing };
  }
  if (db.classes.some((room) => room.code === SAMPLE_CLASS_CODE) || db.linkCodes.some((item) => item.code === SAMPLE_CLASS_CODE)) {
    return { ok: false, db, error: 'already' };
  }

  const specs = [
    {
      id: 'sample-haneul',
      nickname: '예시·하늘',
      lang: 'vi' as const,
      ageBand: '14p' as const,
      consent: 'not_required' as const,
      status: 'active' as const,
      answers: profile({
        entered: true,
        onboarded: true,
        consentDecided: true,
        grade: 'high',
        region: 'seoul',
        studentType: 'domestic_multicultural',
        parentForeign: 'mother',
        motherCountry: 'VN',
        homeLanguages: ['ko', 'vi'],
        bornAbroad: false,
        yearsSchoolingAbroad: 0,
        koreanNationality: true,
        schoolType: 'general',
        koreanLevel: 'topik_3_4',
        gradeBand: 'upper',
        interests: ['health'],
        goal: 'study',
        supportNeeds: ['counseling'],
      }),
    },
    {
      id: 'sample-bada',
      nickname: '예시·바다',
      lang: 'zh-Hans' as const,
      ageBand: '14p' as const,
      consent: 'not_required' as const,
      status: 'active' as const,
      answers: profile({
        entered: true,
        onboarded: true,
        consentDecided: true,
        grade: 'high',
        region: 'seoul',
        studentType: 'foreign_family',
        parentForeign: 'both',
        fatherCountry: 'CN',
        motherCountry: 'CN',
        homeLanguages: ['zh'],
        bornAbroad: true,
        yearArrived: 2022,
        yearsSchoolingAbroad: 6,
        koreanNationality: false,
        schoolType: 'general',
        koreanLevel: 'topik_5_6',
        gradeBand: 'middle',
        interests: ['it'],
        goal: 'study',
        supportNeeds: ['documents'],
      }),
    },
    {
      id: 'sample-byeol',
      nickname: '예시·별',
      lang: 'ru' as const,
      ageBand: '14p' as const,
      consent: 'not_required' as const,
      status: 'active' as const,
      answers: profile({
        entered: true,
        grade: 'middle',
        region: 'seoul',
        studentType: 'mid_entry',
        bornAbroad: true,
        yearsSchoolingAbroad: 4,
        koreanNationality: false,
        koreanLevel: 'beginner',
        interests: ['it'],
        goal: 'work',
      }),
    },
    {
      id: 'sample-gureum',
      nickname: '예시·구름',
      lang: 'ar' as const,
      ageBand: 'u14' as const,
      consent: 'simulated' as const,
      status: 'pending' as const,
      answers: profile({ grade: 'high', region: 'gyeonggi' }),
    },
  ];

  let next = db;
  for (const spec of specs) {
    if (!accountById(next, spec.id)) {
      const created = createAccount(next, {
        id: spec.id,
        nickname: spec.nickname,
        role: 'student',
        lang: spec.lang,
        now,
        ageBand: spec.ageBand,
        consent: spec.consent,
        guardianLabel: spec.ageBand === 'u14' ? 'mom' : null,
        sample: true,
      });
      if (!created.ok) return { ok: false, db: created.db, error: created.error };
      next = created.db;
    }
    next = withProfile(next, spec.id, spec.answers);
  }

  if (!accountById(next, 'sample-guardian')) {
    const guardian = createAccount(next, {
      id: 'sample-guardian',
      nickname: '예시·보호자',
      role: 'guardian',
      lang: 'vi',
      now,
      sample: true,
    });
    if (!guardian.ok) return { ok: false, db: next, error: guardian.error };
    next = guardian.db;
  }

  const room: DemoClass = {
    id: SAMPLE_CLASS_ID,
    name: '예시반 · 가상',
    ownerId: teacherId,
    code: SAMPLE_CLASS_CODE,
    createdAt: now,
    expiresAt: '2099-01-01T00:00:00.000Z',
    sample: true,
  };
  next = {
    ...next,
    classes: [...next.classes, room],
    enrollments: [
      ...next.enrollments,
      ...specs.map((spec) => ({ classId: room.id, studentId: spec.id, status: spec.status, joinedAt: now })),
    ],
    links: [
      ...next.links,
      {
        id: 'sample-link',
        guardianId: 'sample-guardian',
        studentId: 'sample-haneul',
        status: 'active' as const,
        createdAt: now,
        revokedAt: null,
      },
    ],
    access: [
      ...next.access,
      {
        id: 'sample-view',
        at: now,
        actorId: teacherId,
        actorNickname: teacher.nickname,
        actorRole: 'teacher' as const,
        action: 'view_student' as const,
        subjectStudentId: 'sample-haneul',
        classId: room.id,
      },
    ],
  };
  return { ok: true, db: next, value: room };
}

export function sampleDb(teacherId: string, now: string): DemoDb {
  const teacher = createAccount(emptyDemo(), { id: teacherId, nickname: '예시·선생', role: 'teacher', lang: 'ko', now, sample: true });
  if (!teacher.ok) return emptyDemo();
  const loaded = loadSample(teacher.db, teacherId, now);
  return loaded.ok ? loaded.db : teacher.db;
}
