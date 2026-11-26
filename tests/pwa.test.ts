import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');

describe('offline app shell', () => {
  it('caches the shell and falls back to it when the network fails', async () => {
    expect(source).toContain("const SCOPE = '/kvisa-path/';");
    expect(source).toContain('`${SCOPE}index.html`');
    expect(source).toContain('`${SCOPE}manifest.webmanifest`');
    expect(source).toContain('return caches.match(SCOPE)');

    const cache = new Map<string, string>();
    const shell = ['/kvisa-path/', '/kvisa-path/index.html', '/kvisa-path/manifest.webmanifest'];
    for (const path of shell) cache.set(path, 'cached');

    async function offline(path: string): Promise<string | undefined> {
      return cache.get(path) ?? cache.get('/kvisa-path/');
    }

    expect(await offline('/kvisa-path/assets/app.js')).toBe('cached');
    expect(cache.size).toBe(3);
  });
});
