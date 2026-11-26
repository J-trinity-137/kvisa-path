import { isSupportedLang, type SupportedLangCode } from '../kbridge';
import { EMPTY_PROFILE, parseProfile, serializeProfile, type StudentProfile } from '../profile/profile';
import {
  emptyDemo,
  type AgeBand,
  type ConsentState,
  type DemoAccess,
  type DemoAccount,
  type DemoClass,
  type DemoDb,
  type DemoEnrollment,
  type DemoLink,
  type DemoLinkCode,
  type EnrollmentStatus,
  type GuardianLabel,
  type LinkStatus,
  type Role,
} from './model';

export const DEMO_STORAGE_KEY = 'kvisa-path.demo-accounts';
const IDB_NAME = 'kvisa-path-demo';
const IDB_STORE = 'kv';

const ROLES: readonly Role[] = ['student', 'guardian', 'teacher'];
const AGES: readonly AgeBand[] = ['u14', '14p'];
const CONSENTS: readonly ConsentState[] = ['not_required', 'pending', 'simulated'];
const LABELS: readonly GuardianLabel[] = ['mom', 'dad', 'guardian', 'grandmother', 'grandfather'];
const ENROLL: readonly EnrollmentStatus[] = ['pending', 'active', 'removed'];
const LINKS: readonly LinkStatus[] = ['pending_student', 'active', 'revoked'];

function pick<T extends string>(allowed: readonly T[], value: unknown): T | null {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function langOf(value: unknown): SupportedLangCode {
  return typeof value === 'string' && isSupportedLang(value) ? value : 'ko';
}

function profileFrom(value: unknown): StudentProfile {
  try {
    return parseProfile(JSON.parse(serializeProfile(parseProfile(value))) as unknown);
  } catch {
    return parseProfile(EMPTY_PROFILE);
  }
}

function parseDb(raw: unknown): DemoDb {
  const value = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  if (value.version !== 1) return emptyDemo();
  const accounts: DemoAccount[] = Array.isArray(value.accounts)
    ? value.accounts.flatMap((item) => {
        const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
        const role = pick(ROLES, row.role);
        const nickname = typeof row.nickname === 'string' ? row.nickname.slice(0, 16) : '';
        if (!role || nickname.length < 2 || typeof row.id !== 'string') return [];
        return [
          {
            id: row.id,
            nickname,
            role,
            lang: langOf(row.lang),
            ageBand: pick(AGES, row.ageBand),
            consent: pick(CONSENTS, row.consent) ?? 'not_required',
            guardianLabel: pick(LABELS, row.guardianLabel),
            createdAt: typeof row.createdAt === 'string' ? row.createdAt : '',
            sample: row.sample === true,
          },
        ];
      })
    : [];
  const classes: DemoClass[] = Array.isArray(value.classes)
    ? value.classes.flatMap((item) => {
        const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
        if (typeof row.id !== 'string' || typeof row.ownerId !== 'string' || typeof row.code !== 'string' || typeof row.name !== 'string') return [];
        return [
          {
            id: row.id,
            name: row.name.slice(0, 40),
            ownerId: row.ownerId,
            code: row.code,
            createdAt: typeof row.createdAt === 'string' ? row.createdAt : '',
            expiresAt: typeof row.expiresAt === 'string' ? row.expiresAt : '',
            sample: row.sample === true,
          },
        ];
      })
    : [];
  const enrollments: DemoEnrollment[] = Array.isArray(value.enrollments)
    ? value.enrollments.flatMap((item) => {
        const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
        const status = pick(ENROLL, row.status);
        if (!status || typeof row.classId !== 'string' || typeof row.studentId !== 'string') return [];
        return [{ classId: row.classId, studentId: row.studentId, status, joinedAt: typeof row.joinedAt === 'string' ? row.joinedAt : '' }];
      })
    : [];
  const linkCodes: DemoLinkCode[] = Array.isArray(value.linkCodes)
    ? value.linkCodes.flatMap((item) => {
        const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
        if (typeof row.code !== 'string' || typeof row.studentId !== 'string') return [];
        return [
          {
            code: row.code,
            studentId: row.studentId,
            expiresAt: typeof row.expiresAt === 'string' ? row.expiresAt : '',
            used: row.used === true,
          },
        ];
      })
    : [];
  const links: DemoLink[] = Array.isArray(value.links)
    ? value.links.flatMap((item) => {
        const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
        const status = pick(LINKS, row.status);
        if (!status || typeof row.id !== 'string' || typeof row.guardianId !== 'string' || typeof row.studentId !== 'string') return [];
        return [
          {
            id: row.id,
            guardianId: row.guardianId,
            studentId: row.studentId,
            status,
            createdAt: typeof row.createdAt === 'string' ? row.createdAt : '',
            revokedAt: typeof row.revokedAt === 'string' ? row.revokedAt : null,
          },
        ];
      })
    : [];
  const access: DemoAccess[] = Array.isArray(value.access)
    ? value.access.flatMap((item) => {
        const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
        const actorRole = pick(ROLES, row.actorRole);
        if (!actorRole || row.action !== 'view_student' || typeof row.id !== 'string' || typeof row.subjectStudentId !== 'string') return [];
        return [
          {
            id: row.id,
            at: typeof row.at === 'string' ? row.at : '',
            actorId: typeof row.actorId === 'string' ? row.actorId : '',
            actorNickname: typeof row.actorNickname === 'string' ? row.actorNickname : '',
            actorRole,
            action: 'view_student' as const,
            subjectStudentId: row.subjectStudentId,
            classId: typeof row.classId === 'string' ? row.classId : null,
          },
        ];
      })
    : [];
  const profiles: Record<string, StudentProfile> = {};
  if (value.profiles && typeof value.profiles === 'object') {
    for (const [id, stored] of Object.entries(value.profiles as Record<string, unknown>)) profiles[id] = profileFrom(stored);
  }
  const activeId = typeof value.activeId === 'string' ? value.activeId : null;
  return {
    version: 1,
    accounts,
    activeId,
    anonymousProfile: value.anonymousProfile ? profileFrom(value.anonymousProfile) : null,
    classes,
    enrollments,
    linkCodes,
    links,
    access,
    profiles,
  };
}

export function serializeDemo(db: DemoDb): string {
  const profiles: Record<string, StudentProfile> = {};
  for (const [id, profile] of Object.entries(db.profiles)) profiles[id] = profileFrom(profile);
  const clean: DemoDb = {
    ...db,
    profiles,
    anonymousProfile: db.anonymousProfile ? profileFrom(db.anonymousProfile) : null,
  };
  return JSON.stringify(clean);
}

export function readDemo(): DemoDb {
  if (typeof window === 'undefined') return emptyDemo();
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? parseDb(JSON.parse(raw) as unknown) : emptyDemo();
  } catch {
    return emptyDemo();
  }
}

function mirrorToIndexedDb(json: string): void {
  if (typeof indexedDB === 'undefined') return;
  try {
    const open = indexedDB.open(IDB_NAME, 1);
    open.onupgradeneeded = () => {
      if (!open.result.objectStoreNames.contains(IDB_STORE)) open.result.createObjectStore(IDB_STORE);
    };
    open.onsuccess = () => {
      const database = open.result;
      const tx = database.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(json, 'db');
      tx.oncomplete = () => database.close();
    };
  } catch {
    /* localStorage already has the copy */
  }
}

/** Device only. localStorage is the copy the app reads; IndexedDB keeps a mirror. */
export function persistDemo(db: DemoDb): void {
  if (typeof window === 'undefined') return;
  const json = serializeDemo(db);
  window.localStorage.setItem(DEMO_STORAGE_KEY, json);
  mirrorToIndexedDb(json);
}

export function readDemoFromIndexedDb(): Promise<DemoDb | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const open = indexedDB.open(IDB_NAME, 1);
      open.onerror = () => resolve(null);
      open.onupgradeneeded = () => {
        if (!open.result.objectStoreNames.contains(IDB_STORE)) open.result.createObjectStore(IDB_STORE);
      };
      open.onsuccess = () => {
        const database = open.result;
        const tx = database.transaction(IDB_STORE, 'readonly');
        const req = tx.objectStore(IDB_STORE).get('db');
        req.onsuccess = () => {
          database.close();
          if (typeof req.result !== 'string') {
            resolve(null);
            return;
          }
          try {
            resolve(parseDb(JSON.parse(req.result) as unknown));
          } catch {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}
