/** Unambiguous 8-character codes. 0, 1, I, L, and O are left out (31 symbols). */
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const CODE_RE = new RegExp(`^[${CODE_ALPHABET}]{8}$`);

export function isJoinCode(value: string): boolean {
  return CODE_RE.test(value);
}

function randomIndex(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

export function randomCode(draw: (max: number) => number = randomIndex): string {
  let code = '';
  for (let i = 0; i < 8; i += 1) code += CODE_ALPHABET[draw(CODE_ALPHABET.length)] ?? 'A';
  return code;
}

/** Pull an 8-character code from a typed code or a `#/j/CODE` link. */
export function extractJoinCode(raw: string): string | null {
  const upper = raw.trim().toUpperCase();
  if (isJoinCode(upper)) return upper;
  const tagged = upper.match(new RegExp(`/J/([${CODE_ALPHABET}]{8})(?:[^${CODE_ALPHABET}]|$)`));
  return tagged?.[1] ?? null;
}

export function joinPayload(pageUrl: string, code: string): string {
  const base = pageUrl.split('#')[0] ?? pageUrl;
  return `${base}#/j/${code}`;
}

export function addDays(iso: string, days: number): string {
  const date = new Date(iso);
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

export function freshCode(used: ReadonlySet<string>, draw?: (max: number) => number): string {
  for (let i = 0; i < 12; i += 1) {
    const code = randomCode(draw);
    if (!used.has(code)) return code;
  }
  return randomCode(draw);
}
