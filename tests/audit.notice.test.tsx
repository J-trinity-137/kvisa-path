// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LANGUAGES } from '../src/kbridge';
import { EMPTY_PROFILE } from '../src/profile/profile';
import { ParentNotice } from '../src/shell/demo/ParentNotice';

describe('parent notice', () => {
  it('prints in the student language, including Arabic right-to-left', () => {
    for (const lang of LANGUAGES) {
      const view = render(
        <ParentNotice
          lang={lang.code}
          nickname="하늘"
          sample={false}
          profile={{ ...EMPTY_PROFILE, grade: 'middle', region: 'seoul', skipped: [], homeLanguages: [], interests: [], supportNeeds: [] }}
          tracks={[]}
          deadline={{ date: '2027-01-10', title: 'TOPIK' }}
        />,
      );
      const article = view.container.querySelector('article');
      expect(article?.getAttribute('lang')).toBe(lang.locale);
      expect(article?.getAttribute('dir')).toBe(lang.dir);
      expect(article?.textContent).toContain('하늘');
      expect(article?.textContent).toContain('2027');
      view.unmount();
    }
  });
});