// @vitest-environment jsdom
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { FaqPanel } from '../src/components/FaqPanel';
import { FAQ_ITEMS } from '../src/data/faq';
import { FAQ_EMPTY } from '../src/i18n/faqCopy';
import { SUPPORTED_LANGS } from '../src/kbridge';

describe('faq', () => {
  it('starts empty, stays offline, and has an empty state in eight languages', async () => {
    expect(FAQ_ITEMS).toEqual([]);
    for (const item of FAQ_ITEMS) {
      expect(item.sourceUrl.startsWith('https://')).toBe(true);
      expect(item.verifiedOn).toMatch(/^\d{4}-\d{2}$/);
    }
    for (const lang of SUPPORTED_LANGS) expect(FAQ_EMPTY[lang].empty.length).toBeGreaterThan(0);
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { container } = render(<FaqPanel lang="ar" />);
    fireEvent.click(screen.getByRole('button', { name: 'الأسئلة الشائعة' }));
    expect(screen.getByText(FAQ_EMPTY.ar.empty)).toBeTruthy();
    expect(container.querySelector('[dir="rtl"]')).toBeTruthy();
    const results = await axe.run(container);
    expect(results.violations.map((item) => item.id)).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('imports an export with Korean filled and the other languages blank', () => {
    const dir = mkdtempSync(join(tmpdir(), 'faq-'));
    const input = join(dir, 'faq-export.json');
    writeFileSync(
      input,
      JSON.stringify([
        {
          id: 'faq-ged-001',
          topic: 'ged',
          question_ko: '검정고시 질문',
          answer_ko: '학교 요강을 확인합니다.',
          source_url: 'https://www.moe.go.kr/',
          verified_on: '2026-11',
        },
      ]),
    );
    const output = execFileSync('node', ['scripts/faq-import.mjs', input], { encoding: 'utf8' });
    expect(output).toContain('검정고시 질문');
    expect(output).toContain('"en": ""');
    expect(output).toContain('https://www.moe.go.kr/');
  });
});
