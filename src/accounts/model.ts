import { isSupportedLang, type SupportedLangCode } from '../kbridge';
import { EMPTY_PROFILE, parseProfile, type StudentProfile } from '../profile/profile';
import { addDays, extractJoinCode, freshCode, isJoinCode } from './codes';

export const DEMO_BANNER = '시연 모드 — 이 기기에만 저장';

export type Role = 'student' | 'guardian' | 'teacher';
export type AgeBand = 'u14' | '14p';
export type ConsentState = 'not_required' | 'pending' | 'simulated';
export type GuardianLabel = 'mom' | 'dad' | 'guardian' | 'grandmother' | 'grandfather';
export type EnrollmentStatus = 'pending' | 'active' | 'removed';
export type LinkStatus = 'pending_student' | 'active' | 'revoked';

export type DemoError =
  | 'bad_nickname'
  | 'bad_class_name'
  | 'need_age'
  | 'bad_code'
  | 'not_found'
  | 'expired'
  | 'used'
  | 'already'
  | 'forbidden'
  | 'need_consent'
  | 'not_owner';

export interface DemoAccount {
  id: string;
  nickname: string;
  role: Role;
  /** Home language for the parent notice. The app language stays on the device. */
  lang: SupportedLangCode;
  ageBand: AgeBand | null;
  consent: ConsentState;
  guardianLabel: GuardianLabel | null;
  createdAt: string;
  sample: boolean;
}

export interface DemoClass {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  sample: boolean;
}

export interface DemoEnrollment {
  classId: string;
  studentId: string;
  status: EnrollmentStatus;
  joinedAt: string;
}

export interface DemoLinkCode {
  code: string;
  studentId: string;
  expiresAt: string;
  used: boolean;
}

export interface DemoLink {
  id: string;
  guardianId: string;
  studentId: string;
  status: LinkStatus;
  createdAt: string;
  revokedAt: string | null;
}

export interface DemoAccess {
  id: string;
  at: string;
  actorId: string;
  actorNickname: string;
  actorRole: Role;
  action: 'view_student';
  subjectStudentId: string;
  classId: string | null;
}

/** Accounts, classes, and links. Student answers live in `profiles` as StudentProfile. */
export interface DemoDb {
  version: 1;
  accounts: DemoAccount[];
  activeId: string | null;
  anonymousProfile: StudentProfile | null;
  classes: DemoClass[];
  enrollments: DemoEnrollment[];
  linkCodes: DemoLinkCode[];
  links: DemoLink[];
  access: DemoAccess[];
  profiles: Record<string, StudentProfile>;
}

export type DemoResult<T> = { ok: true; db: DemoDb; value: T } | { ok: false; db: DemoDb; error: DemoError };

const VISA_CODE = /(?:^|[^A-Z])[A-H]-\d(?:[^0-9]|$)/i;
const LONG_DIGITS = /\d{6,}/;
const PHONE = /01[016789][- ]?\d{3,4}[- ]?\d{4}/;
const LABELS: readonly GuardianLabel[] = ['mom', 'dad', 'guardian', 'grandmother', 'grandfather'];

export function emptyDemo(): DemoDb {
  return {
    version: 1,
    accounts: [],
    activeId: null,
    anonymousProfile: null,
    classes: [],
    enrollments: [],
    linkCodes: [],
    links: [],
    access: [],
    profiles: {},
  };
}

export function cleanNickname(value: string): string | null {
  const name = value.trim();
  if (name.length < 2 || name.length > 16) return null;
  if (name.includes('@') || LONG_DIGITS.test(name) || VISA_CODE.test(name) || PHONE.test(name)) return null;
  return name;
}

export function cleanClassName(value: string): string | null {
  const name = value.trim();
  if (name.length < 2 || name.length > 40) return null;
  if (LONG_DIGITS.test(name) || VISA_CODE.test(name)) return null;
  return name;
}

function uid(prefix: string): string {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `${prefix}-${id}`;
}

function fail<T>(db: DemoDb, error: DemoError): DemoResult<T> {
  return { ok: false, db, error };
}

export function accountById(db: DemoDb, id: string | null | undefined): DemoAccount | null {
  if (!id) return null;
  return db.accounts.find((account) => account.id === id) ?? null;
}

export function activeAccount(db: DemoDb): DemoAccount | null {
  return accountById(db, db.activeId);
}

export function profileFor(db: DemoDb, studentId: string): StudentProfile {
  return parseProfile(db.profiles[studentId] ?? EMPTY_PROFILE);
}

export function withProfile(db: DemoDb, studentId: string, profile: StudentProfile): DemoDb {
  return { ...db, profiles: { ...db.profiles, [studentId]: parseProfile(profile) } };
}

function usedCodes(db: DemoDb): Set<string> {
  return new Set([...db.classes.map((room) => room.code), ...db.linkCodes.map((item) => item.code)]);
}

function blankProfile(): StudentProfile {
  return parseProfile(EMPTY_PROFILE);
}

export interface CreateAccountInput {
  nickname: string;
  role: Role;
  lang: SupportedLangCode;
  now: string;
  ageBand?: AgeBand | null;
  consent?: ConsentState;
  guardianLabel?: GuardianLabel | null;
  sample?: boolean;
  id?: string;
}

export function createAccount(db: DemoDb, input: CreateAccountInput): DemoResult<DemoAccount> {
  const nickname = cleanNickname(input.nickname);
  if (!nickname) return fail(db, 'bad_nickname');
  if (input.role !== 'student' && input.role !== 'guardian' && input.role !== 'teacher') return fail(db, 'forbidden');
  const lang = isSupportedLang(input.lang) ? input.lang : 'ko';
  let ageBand: AgeBand | null = null;
  let consent: ConsentState = 'not_required';
  let guardianLabel: GuardianLabel | null = null;
  if (input.role === 'student') {
    if (input.ageBand !== 'u14' && input.ageBand !== '14p') return fail(db, 'need_age');
    ageBand = input.ageBand;
    if (ageBand === 'u14') {
      consent = input.consent === 'simulated' ? 'simulated' : 'pending';
      guardianLabel = input.guardianLabel && LABELS.includes(input.guardianLabel) ? input.guardianLabel : 'guardian';
    }
  }
  const account: DemoAccount = {
    id: input.id ?? uid('acct'),
    nickname,
    role: input.role,
    lang,
    ageBand,
    consent,
    guardianLabel,
    createdAt: input.now,
    sample: input.sample === true,
  };
  const profiles = input.role === 'student' ? { ...db.profiles, [account.id]: blankProfile() } : db.profiles;
  return { ok: true, db: { ...db, accounts: [...db.accounts, account], profiles }, value: account };
}

export function setAccountLang(db: DemoDb, accountId: string, lang: SupportedLangCode): DemoDb {
  if (!isSupportedLang(lang)) return db;
  return {
    ...db,
    accounts: db.accounts.map((account) => (account.id === accountId ? { ...account, lang } : account)),
  };
}

export function grantSimulatedConsent(db: DemoDb, studentId: string): DemoResult<DemoAccount> {
  const account = accountById(db, studentId);
  if (!account || account.role !== 'student' || account.ageBand !== 'u14') return fail(db, 'forbidden');
  const next = { ...account, consent: 'simulated' as const };
  return {
    ok: true,
    db: { ...db, accounts: db.accounts.map((item) => (item.id === studentId ? next : item)) },
    value: next,
  };
}

export function createClass(
  db: DemoDb,
  teacherId: string,
  name: string,
  now: string,
  draw?: (max: number) => number,
): DemoResult<DemoClass> {
  const teacher = accountById(db, teacherId);
  if (!teacher || teacher.role !== 'teacher') return fail(db, 'forbidden');
  const className = cleanClassName(name);
  if (!className) return fail(db, 'bad_class_name');
  const room: DemoClass = {
    id: uid('class'),
    name: className,
    ownerId: teacherId,
    code: freshCode(usedCodes(db), draw),
    createdAt: now,
    expiresAt: addDays(now, 14),
    sample: false,
  };
  return { ok: true, db: { ...db, classes: [...db.classes, room] }, value: room };
}

export function regenerateClassCode(
  db: DemoDb,
  teacherId: string,
  classId: string,
  now: string,
  draw?: (max: number) => number,
): DemoResult<DemoClass> {
  const room = db.classes.find((item) => item.id === classId);
  if (!room || room.ownerId !== teacherId) return fail(db, 'not_owner');
  const next: DemoClass = { ...room, code: freshCode(usedCodes(db), draw), expiresAt: addDays(now, 14) };
  return {
    ok: true,
    db: { ...db, classes: db.classes.map((item) => (item.id === classId ? next : item)) },
    value: next,
  };
}

function liveClass(db: DemoDb, code: string, now: string): DemoClass | DemoError {
  if (!isJoinCode(code)) return 'bad_code';
  const room = db.classes.find((item) => item.code === code);
  if (!room) return 'not_found';
  if (room.expiresAt <= now) return 'expired';
  return room;
}

export function joinClass(db: DemoDb, studentId: string, rawCode: string, now: string): DemoResult<DemoEnrollment> {
  const student = accountById(db, studentId);
  if (!student || student.role !== 'student') return fail(db, 'forbidden');
  if (student.consent === 'pending') return fail(db, 'need_consent');
  const code = extractJoinCode(rawCode);
  if (!code) return fail(db, 'bad_code');
  const room = liveClass(db, code, now);
  if (typeof room === 'string') return fail(db, room);
  const existing = db.enrollments.find((item) => item.classId === room.id && item.studentId === studentId);
  if (existing && (existing.status === 'pending' || existing.status === 'active')) return fail(db, 'already');
  const enrollment: DemoEnrollment = { classId: room.id, studentId, status: 'pending', joinedAt: now };
  const enrollments = existing
    ? db.enrollments.map((item) => (item === existing ? enrollment : item))
    : [...db.enrollments, enrollment];
  return { ok: true, db: { ...db, enrollments }, value: enrollment };
}

function ownEnrollment(db: DemoDb, teacherId: string, classId: string, studentId: string): DemoEnrollment | DemoError {
  const room = db.classes.find((item) => item.id === classId);
  if (!room || room.ownerId !== teacherId) return 'not_owner';
  const enrollment = db.enrollments.find((item) => item.classId === classId && item.studentId === studentId);
  if (!enrollment) return 'not_found';
  return enrollment;
}

export function approveEnrollment(
  db: DemoDb,
  teacherId: string,
  classId: string,
  studentId: string,
  now: string,
): DemoResult<DemoEnrollment> {
  const found = ownEnrollment(db, teacherId, classId, studentId);
  if (typeof found === 'string') return fail(db, found);
  if (found.status === 'removed') return fail(db, 'forbidden');
  const next: DemoEnrollment = { ...found, status: 'active', joinedAt: found.joinedAt || now };
  return {
    ok: true,
    db: { ...db, enrollments: db.enrollments.map((item) => (item.classId === classId && item.studentId === studentId ? next : item)) },
    value: next,
  };
}

export function removeEnrollment(db: DemoDb, teacherId: string, classId: string, studentId: string): DemoResult<DemoEnrollment> {
  const found = ownEnrollment(db, teacherId, classId, studentId);
  if (typeof found === 'string') return fail(db, found);
  const next: DemoEnrollment = { ...found, status: 'removed' };
  return {
    ok: true,
    db: { ...db, enrollments: db.enrollments.map((item) => (item.classId === classId && item.studentId === studentId ? next : item)) },
    value: next,
  };
}

export function issueGuardianCode(
  db: DemoDb,
  studentId: string,
  now: string,
  draw?: (max: number) => number,
): DemoResult<DemoLinkCode> {
  const student = accountById(db, studentId);
  if (!student || student.role !== 'student') return fail(db, 'forbidden');
  if (student.consent === 'pending') return fail(db, 'need_consent');
  const code: DemoLinkCode = { code: freshCode(usedCodes(db), draw), studentId, expiresAt: addDays(now, 1), used: false };
  const linkCodes = db.linkCodes.filter((item) => item.studentId !== studentId || item.used);
  return { ok: true, db: { ...db, linkCodes: [...linkCodes, code] }, value: code };
}

export function redeemGuardianCode(db: DemoDb, guardianId: string, rawCode: string, now: string): DemoResult<DemoLink> {
  const guardian = accountById(db, guardianId);
  if (!guardian || guardian.role !== 'guardian') return fail(db, 'forbidden');
  const code = extractJoinCode(rawCode);
  if (!code) return fail(db, 'bad_code');
  const invite = db.linkCodes.find((item) => item.code === code);
  if (!invite) return fail(db, 'not_found');
  if (invite.used) return fail(db, 'used');
  if (invite.expiresAt <= now) return fail(db, 'expired');
  const student = accountById(db, invite.studentId);
  if (!student || student.role !== 'student') return fail(db, 'not_found');
  if (student.consent === 'pending') return fail(db, 'need_consent');
  const existing = db.links.find((item) => item.guardianId === guardianId && item.studentId === student.id);
  if (existing && (existing.status === 'active' || existing.status === 'pending_student')) return fail(db, 'already');
  const status: LinkStatus = student.ageBand === 'u14' && student.consent === 'simulated' ? 'active' : 'pending_student';
  const link: DemoLink = {
    id: existing?.id ?? uid('link'),
    guardianId,
    studentId: student.id,
    status,
    createdAt: now,
    revokedAt: null,
  };
  const links = existing ? db.links.map((item) => (item.id === existing.id ? link : item)) : [...db.links, link];
  const linkCodes = db.linkCodes.map((item) => (item.code === code ? { ...item, used: true } : item));
  return { ok: true, db: { ...db, links, linkCodes }, value: link };
}

export function confirmGuardianLink(db: DemoDb, studentId: string, linkId: string): DemoResult<DemoLink> {
  const link = db.links.find((item) => item.id === linkId);
  if (!link || link.studentId !== studentId) return fail(db, 'forbidden');
  if (link.status !== 'pending_student') return fail(db, 'already');
  const next: DemoLink = { ...link, status: 'active', revokedAt: null };
  return { ok: true, db: { ...db, links: db.links.map((item) => (item.id === linkId ? next : item)) }, value: next };
}

/** Either side can end the link. The stored row has no “who ended it” field. */
export function unlinkGuardian(db: DemoDb, actorId: string, linkId: string, now: string): DemoResult<DemoLink> {
  const link = db.links.find((item) => item.id === linkId);
  if (!link) return fail(db, 'not_found');
  if (link.studentId !== actorId && link.guardianId !== actorId) return fail(db, 'forbidden');
  if (link.status === 'revoked') return fail(db, 'already');
  const next: DemoLink = { ...link, status: 'revoked', revokedAt: now };
  return { ok: true, db: { ...db, links: db.links.map((item) => (item.id === linkId ? next : item)) }, value: next };
}

export function recordView(db: DemoDb, actorId: string, studentId: string, classId: string, now: string): DemoResult<DemoAccess> {
  const actor = accountById(db, actorId);
  const room = db.classes.find((item) => item.id === classId);
  if (!actor || actor.role !== 'teacher' || !room || room.ownerId !== actorId) return fail(db, 'not_owner');
  const enrollment = db.enrollments.find((item) => item.classId === classId && item.studentId === studentId && item.status !== 'removed');
  if (!enrollment) return fail(db, 'not_found');
  const entry: DemoAccess = {
    id: uid('view'),
    at: now,
    actorId,
    actorNickname: actor.nickname,
    actorRole: actor.role,
    action: 'view_student',
    subjectStudentId: studentId,
    classId,
  };
  const access = [...db.access, entry].slice(-400);
  return { ok: true, db: { ...db, access }, value: entry };
}

/** Student, or a guardian with an active link. Revoked guardians get nothing. */
export function accessFor(db: DemoDb, viewerId: string, studentId: string): DemoAccess[] | null {
  const viewer = accountById(db, viewerId);
  if (!viewer) return null;
  if (viewer.role === 'student' && viewer.id === studentId) {
    return db.access.filter((item) => item.subjectStudentId === studentId);
  }
  if (viewer.role === 'guardian') {
    const linked = db.links.some((item) => item.guardianId === viewerId && item.studentId === studentId && item.status === 'active');
    if (!linked) return null;
    return db.access.filter((item) => item.subjectStudentId === studentId);
  }
  return null;
}

export function openLinkCode(db: DemoDb, studentId: string, now: string): DemoLinkCode | null {
  return db.linkCodes.find((item) => item.studentId === studentId && !item.used && item.expiresAt > now) ?? null;
}
