import type { GradeLevel, StudentProfile } from '../profile/profile';
import { stepAnswered, visibleSteps } from '../profile/profile';
import { eligibleTracks } from '../rules/evaluate';
import type { EligibleTrack } from '../rules/types';
import { accountById, profileFor, type DemoDb, type EnrollmentStatus } from './model';

export function onboardingPercent(profile: StudentProfile): number {
  const steps = visibleSteps(profile);
  if (steps.length === 0) return 0;
  const done = steps.filter((step) => stepAnswered(profile, step)).length;
  return Math.round((done / steps.length) * 100);
}

const ISO_DATE = /\d{4}-\d{2}-\d{2}/g;

export function nextDeadline(tracks: readonly EligibleTrack[], now: Date): { date: string; title: string } | null {
  const today = now.toISOString().slice(0, 10);
  let best: { date: string; title: string } | null = null;
  for (const track of tracks) {
    const dates = track.yearLabel.match(ISO_DATE) ?? [];
    for (const date of dates) {
      if (date < today) continue;
      if (!best || date < best.date) best = { date, title: track.title };
    }
  }
  return best;
}

export interface RosterRow {
  studentId: string;
  nickname: string;
  sample: boolean;
  lang: DemoDb['accounts'][number]['lang'];
  ageBand: DemoDb['accounts'][number]['ageBand'];
  status: EnrollmentStatus;
  grade: GradeLevel | null;
  percent: number;
  tracks: EligibleTrack[];
  deadline: { date: string; title: string } | null;
}

export function rosterRows(db: DemoDb, classId: string, now: Date): RosterRow[] {
  return db.enrollments
    .filter((item) => item.classId === classId && item.status !== 'removed')
    .map((item) => {
      const account = accountById(db, item.studentId);
      const profile = profileFor(db, item.studentId);
      const tracks = eligibleTracks(profile);
      return {
        studentId: item.studentId,
        nickname: account?.nickname ?? '',
        sample: account?.sample === true,
        lang: account?.lang ?? 'ko',
        ageBand: account?.ageBand ?? null,
        status: item.status,
        grade: profile.grade,
        percent: onboardingPercent(profile),
        tracks,
        deadline: nextDeadline(tracks, now),
      };
    })
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
      return a.nickname.localeCompare(b.nickname, 'ko');
    });
}

export interface RosterFilter {
  status: 'all' | 'pending' | 'active';
  grade: 'all' | GradeLevel;
  progress: 'all' | 'done' | 'open';
  query: string;
}

export function filterRoster(rows: readonly RosterRow[], filter: RosterFilter): RosterRow[] {
  const query = filter.query.trim().toLowerCase();
  return rows.filter((row) => {
    if (filter.status !== 'all' && row.status !== filter.status) return false;
    if (filter.grade !== 'all' && row.grade !== filter.grade) return false;
    if (filter.progress === 'done' && row.percent < 100) return false;
    if (filter.progress === 'open' && row.percent >= 100) return false;
    if (!query) return true;
    const haystack = `${row.nickname} ${row.tracks.map((track) => track.title).join(' ')}`.toLowerCase();
    return haystack.includes(query);
  });
}

export interface LinkFace {
  id: string;
  studentId: string;
  guardianId: string;
  nickname: string;
}

export function guardianLinks(db: DemoDb, guardianId: string): { active: LinkFace[]; pending: LinkFace[]; ended: boolean } {
  const mine = db.links.filter((item) => item.guardianId === guardianId);
  const face = (item: (typeof mine)[number]): LinkFace => ({
    id: item.id,
    studentId: item.studentId,
    guardianId: item.guardianId,
    nickname: accountById(db, item.studentId)?.nickname ?? '',
  });
  return {
    active: mine.filter((item) => item.status === 'active').map(face),
    pending: mine.filter((item) => item.status === 'pending_student').map(face),
    ended: mine.some((item) => item.status === 'revoked'),
  };
}

export function studentLinks(db: DemoDb, studentId: string): { active: LinkFace[]; pending: LinkFace[]; ended: boolean } {
  const mine = db.links.filter((item) => item.studentId === studentId);
  const face = (item: (typeof mine)[number]): LinkFace => ({
    id: item.id,
    studentId: item.studentId,
    guardianId: item.guardianId,
    nickname: accountById(db, item.guardianId)?.nickname ?? '',
  });
  return {
    active: mine.filter((item) => item.status === 'active').map(face),
    pending: mine.filter((item) => item.status === 'pending_student').map(face),
    ended: mine.some((item) => item.status === 'revoked'),
  };
}
