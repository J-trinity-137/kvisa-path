import { useState } from 'react';
import { extractJoinCode } from '../../accounts/codes';
import {
  activeAccount,
  createAccount,
  issueGuardianCode,
  joinClass,
  openLinkCode,
  redeemGuardianCode,
  confirmGuardianLink,
  setAccountLang,
  unlinkGuardian,
  type DemoDb,
  type DemoError,
} from '../../accounts/model';
import { switchAccount, type SessionChange } from '../../accounts/session';
import { accountsCopy } from '../../i18n/accountsCopy';
import type { SupportedLangCode } from '../../kbridge';
import type { StudentProfile } from '../../profile/profile';
import type { AppRoute } from '../route';
import { FamilyPanel } from './FamilyPanel';
import { JoinPanel } from './JoinPanel';
import { SignupPanel } from './SignupPanel';
import { TeacherDesk } from './TeacherDesk';

export function DemoHost({
  lang,
  route,
  db,
  profile,
  onSession,
  onDb,
  go,
}: {
  lang: SupportedLangCode;
  route: AppRoute;
  db: DemoDb;
  profile: StudentProfile;
  onSession: (change: SessionChange) => void;
  onDb: (next: DemoDb) => void;
  go: (route: AppRoute) => void;
}) {
  const copy = accountsCopy(lang);
  const [error, setError] = useState<DemoError | null>(null);
  const active = activeAccount(db);
  const errorText = error ? copy.errors[error] : null;
  const now = () => new Date().toISOString();

  if (route.name === 'accounts') {
    return (
      <SignupPanel
        lang={lang}
        error={errorText}
        onCreate={(input) => {
          const result = createAccount(db, { ...input, lang, now: now() });
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setError(null);
          const change = switchAccount(result.db, profile, result.value.id);
          onSession(change);
          if (result.value.role === 'teacher') go({ name: 'class' });
          else if (result.value.role === 'guardian') go({ name: 'family' });
          else go(change.profile.entered ? { name: 'join' } : { name: 'onboarding' });
        }}
      />
    );
  }

  if (route.name === 'class') {
    if (active?.role !== 'teacher') {
      return (
        <section className="panel demo-panel">
          <h1>{copy.roster}</h1>
          <p>{copy.notTeacher}</p>
        </section>
      );
    }
    return <TeacherDesk lang={lang} db={db} teacherId={active.id} onDb={onDb} />;
  }

  if (route.name === 'join') {
    if (active?.role !== 'student') {
      return (
        <section className="panel demo-panel">
          <h1>{copy.joinTitle}</h1>
          <p>{copy.notStudent}</p>
        </section>
      );
    }
    const rows = db.enrollments
      .filter((item) => item.studentId === active.id && item.status !== 'removed')
      .map((item) => ({
        id: item.classId,
        name: db.classes.find((room) => room.id === item.classId)?.name ?? item.classId,
        status: item.status === 'active' ? ('active' as const) : ('pending' as const),
      }));
    return (
      <JoinPanel
        lang={lang}
        initialCode={extractJoinCode(route.code ?? '') ?? ''}
        rows={rows}
        error={errorText}
        onJoin={(code) => {
          const result = joinClass(db, active.id, code, now());
          if (!result.ok) setError(result.error);
          else {
            setError(null);
            onDb(result.db);
          }
        }}
      />
    );
  }

  if (route.name !== 'family') return null;
  if (!active || (active.role !== 'student' && active.role !== 'guardian')) {
    return (
      <section className="panel demo-panel">
        <h1>{copy.familyTitle}</h1>
        <p>{copy.notStudent}</p>
      </section>
    );
  }
  const invite = active.role === 'student' ? openLinkCode(db, active.id, now()) : null;
  return (
    <FamilyPanel
      lang={lang}
      db={db}
      accountId={active.id}
      error={errorText}
      linkCode={invite?.code ?? null}
      onIssue={() => {
        const result = issueGuardianCode(db, active.id, now());
        if (!result.ok) setError(result.error);
        else {
          setError(null);
          onDb(result.db);
        }
      }}
      onRedeem={(code) => {
        const result = redeemGuardianCode(db, active.id, code, now());
        if (!result.ok) setError(result.error);
        else {
          setError(null);
          onDb(result.db);
        }
      }}
      onConfirm={(linkId) => {
        const result = confirmGuardianLink(db, active.id, linkId);
        if (!result.ok) setError(result.error);
        else {
          setError(null);
          onDb(result.db);
        }
      }}
      onUnlink={(linkId) => {
        const result = unlinkGuardian(db, active.id, linkId, now());
        if (!result.ok) setError(result.error);
        else {
          setError(null);
          onDb(result.db);
        }
      }}
      onHomeLang={(next) => onDb(setAccountLang(db, active.id, next))}
    />
  );
}
