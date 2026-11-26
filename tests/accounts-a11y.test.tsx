// @vitest-environment jsdom
import { fireEvent, render, within } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { createAccount, emptyDemo, type DemoDb } from '../src/accounts/model';
import { loadSample } from '../src/accounts/seed';
import { accountsCopy } from '../src/i18n/accountsCopy';
import { JoinPanel } from '../src/shell/demo/JoinPanel';
import { SignupPanel } from '../src/shell/demo/SignupPanel';
import { TeacherDesk } from '../src/shell/demo/TeacherDesk';

const NOW = '2026-11-26T00:00:00.000Z';

function DeskHarness({ initial }: { initial: DemoDb }) {
  const [db, setDb] = useState(initial);
  const teacher = db.accounts.find((account) => account.role === 'teacher');
  if (!teacher) return null;
  return (
    <main lang="ar" dir="rtl">
      <TeacherDesk lang="ar" db={db} teacherId={teacher.id} onDb={setDb} />
    </main>
  );
}

describe('demo accounts accessibility', () => {
  it('has no axe violations on the Arabic teacher desk, including the student drawer', async () => {
    const teacher = createAccount(emptyDemo(), { nickname: '예시선생', role: 'teacher', lang: 'ar', now: NOW });
    if (!teacher.ok) throw new Error(teacher.error);
    const loaded = loadSample(teacher.db, teacher.value.id, NOW);
    if (!loaded.ok) throw new Error(loaded.error);
    const view = render(<DeskHarness initial={loaded.db} />);
    expect(view.container.querySelector('main')?.getAttribute('dir')).toBe('rtl');
    expect(view.container.textContent).toContain('시연 모드 — 이 기기에만 저장');
    const code = view.container.querySelector('.code-line');
    expect(code?.getAttribute('dir')).toBe('ltr');
    expect(code?.textContent).toContain('FAKE2345');
    expect(view.container.querySelector('svg image, svg [href], img')).toBeNull();
    const row = view.getByRole('row', { name: /구름/ });
    fireEvent.click(within(row).getByRole('button', { name: accountsCopy('ar').open }));
    const notice = view.container.querySelector('.kv-parent-notice');
    expect(notice?.getAttribute('dir')).toBe('rtl');
    expect(notice?.textContent).toContain('시연 모드 — 이 기기에만 저장');
    const results = await axe.run(view.container);
    expect(results.violations.map((item) => `${item.id}:${item.nodes.length}`)).toEqual([]);
    view.unmount();
  });

  it('shows the under-14 consent step and keeps a manual code field', async () => {
    const created: { consent?: string } = {};
    const signup = render(
      <div lang="ar" dir="rtl">
        <SignupPanel
          lang="ar"
          error={null}
          onCreate={(input) => {
            created.consent = input.consent;
          }}
        />
      </div>,
    );
    expect(signup.container.querySelector('input[type="password"]')).toBeNull();
    fireEvent.change(signup.getByRole('textbox', { name: accountsCopy('ar').nickname }), { target: { value: 'نبتة' } });
    fireEvent.click(signup.getByRole('radio', { name: accountsCopy('ar').ageUnder }));
    fireEvent.click(signup.getByRole('button', { name: accountsCopy('ar').continue }));
    expect(signup.getByRole('heading', { name: accountsCopy('ar').consentTitle })).toBeTruthy();
    fireEvent.click(signup.getByRole('button', { name: accountsCopy('ar').consentSimulate }));
    expect(created.consent).toBe('simulated');
    const signupAxe = await axe.run(signup.container);
    expect(signupAxe.violations.map((item) => item.id)).toEqual([]);
    signup.unmount();

    const join = render(
      <JoinPanel lang="ar" initialCode="FAKE2345" rows={[]} error={null} onJoin={() => undefined} />,
    );
    expect(join.getByRole('textbox', { name: accountsCopy('ar').code }).getAttribute('dir')).toBe('ltr');
    fireEvent.click(join.getByRole('button', { name: accountsCopy('ar').scan }));
    expect(join.getByRole('status').textContent).toBe(accountsCopy('ar').scanUnavailable);
    const joinAxe = await axe.run(join.container);
    expect(joinAxe.violations.map((item) => item.id)).toEqual([]);
  });
});
