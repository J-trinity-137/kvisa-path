import { EMPTY_PROFILE, parseProfile, type StudentProfile } from '../profile/profile';
import { activeAccount, profileFor, withProfile, type DemoDb } from './model';

export interface SessionChange {
  db: DemoDb;
  profile: StudentProfile;
}

function blankEntered(): StudentProfile {
  return parseProfile({ ...EMPTY_PROFILE, entered: true });
}

/**
 * Switch the demo account and keep student answers in the existing profile record.
 * Leaving a student restores the device profile captured before the first student session.
 */
export function switchAccount(db: DemoDb, currentProfile: StudentProfile, nextId: string | null): SessionChange {
  const active = activeAccount(db);
  let next = active?.role === 'student' ? withProfile(db, active.id, currentProfile) : db;
  if (!nextId) {
    const profile = next.anonymousProfile ? parseProfile(next.anonymousProfile) : active?.role === 'student' ? blankEntered() : currentProfile;
    return { db: { ...next, activeId: null }, profile };
  }
  const account = next.accounts.find((item) => item.id === nextId);
  if (!account) return { db: next, profile: currentProfile };
  if (account.role !== 'student') {
    const leavingStudent = active?.role === 'student';
    const profile = leavingStudent ? parseProfile(next.anonymousProfile ?? blankEntered()) : currentProfile;
    return { db: { ...next, activeId: account.id }, profile };
  }
  if (!next.anonymousProfile && active?.role !== 'student') {
    next = { ...next, anonymousProfile: parseProfile(currentProfile) };
  }
  return { db: { ...next, activeId: account.id }, profile: profileFor(next, account.id) };
}

/** Write the open profile back into the one profile store for the active student. */
export function noteProfileEdit(db: DemoDb, profile: StudentProfile): DemoDb {
  const active = activeAccount(db);
  if (!active) return db;
  if (active.role === 'student') return withProfile(db, active.id, profile);
  return { ...db, anonymousProfile: parseProfile(profile) };
}
