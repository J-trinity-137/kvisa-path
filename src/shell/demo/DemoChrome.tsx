import { DEMO_BANNER, type DemoAccount, type Role } from '../../accounts/model';
import { accountsCopy } from '../../i18n/accountsCopy';
import type { SupportedLangCode } from '../../kbridge';

function roleName(lang: SupportedLangCode, role: Role): string {
  const copy = accountsCopy(lang);
  if (role === 'student') return copy.roleStudent;
  if (role === 'guardian') return copy.roleGuardian;
  return copy.roleTeacher;
}

export function DemoChrome({
  lang,
  accounts,
  activeId,
  onSwitch,
}: {
  lang: SupportedLangCode;
  accounts: DemoAccount[];
  activeId: string | null;
  onSwitch: (id: string | null) => void;
}) {
  const copy = accountsCopy(lang);
  return (
    <div className="demo-side">
      <p className="demo-flag">
        <bdi dir="ltr">{DEMO_BANNER}</bdi>
      </p>
      <label className="demo-switch">
        {copy.switcher}
        <select value={activeId ?? ''} onChange={(event) => onSwitch(event.target.value || null)}>
          <option value="">{copy.signedOut}</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.nickname} · {roleName(lang, account.role)}
              {account.sample ? ` · ${copy.sampleBadge}` : ''}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
