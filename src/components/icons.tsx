import type { ReactNode } from 'react';

const PATHS: Record<string, ReactNode> = {
  check: <path d="M5 12.5 9.2 17 19 7" />,
  minus: <path d="M6 12h12" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.2 2.4 3.4 5.1 3.4 8s-1.2 5.6-3.4 8c-2.2-2.4-3.4-5.1-3.4-8s1.2-5.6 3.4-8Z" />
    </>
  ),
  book: (
    <>
      <path d="M5 5.5h6.2A2.8 2.8 0 0 1 14 8.3V19a2.2 2.2 0 0 0-2.2-2.2H5V5.5Z" />
      <path d="M19 5.5h-6.2A2.8 2.8 0 0 0 10 8.3V19a2.2 2.2 0 0 1 2.2-2.2H19V5.5Z" />
    </>
  ),
  school: (
    <>
      <path d="M3 10 12 5l9 5-9 5-9-5Z" />
      <path d="M7 12.2V17c1.6 1.2 3.2 1.8 5 1.8s3.4-.6 5-1.8v-4.8" />
    </>
  ),
  cap: (
    <>
      <path d="M3 10 12 6l9 4-9 4-9-4Z" />
      <path d="M7 12v4.2c1.5 1.2 3.1 1.8 5 1.8s3.5-.6 5-1.8V12" />
      <path d="M21 10v5" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 19c.8-2.8 2.8-4.2 5.5-4.2s4.7 1.4 5.5 4.2" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="9" r="2.4" />
      <circle cx="16" cy="9.5" r="2" />
      <path d="M4.8 18.5c.6-2.4 2.2-3.6 4.4-3.6 2.1 0 3.6 1.1 4.3 3.2" />
      <path d="M13 15.2c1.3-.5 2.5-.4 3.6.2 1.2.7 1.9 1.8 2.3 3.1" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="1.8" />
    </>
  ),
  briefcase: (
    <>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M9 8V6.8A1.8 1.8 0 0 1 10.8 5h2.4A1.8 1.8 0 0 1 15 6.8V8M4 13h16" />
    </>
  ),
  signal1: <path d="M6 16v2M10 16v2M14 16v2M18 16v2M6 16h.01" />,
  signal2: <path d="M7 16v2M12 12v6M17 16v2" />,
  signal3: <path d="M6 16v2M12 10v8M18 6v12" />,
  help: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14" />
      <path d="M12 17h.01" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4" />
    </>
  ),
  pan: (
    <>
      <path d="M5 14h11a3 3 0 0 0 0-6H8" />
      <path d="M7 8V5M4 14c0 2 1.4 3.5 3.5 3.5H15" />
    </>
  ),
  pen: <path d="M14 5.5 18.5 10 9 19.5H4.5V15L14 5.5Z" />,
  heart: <path d="M12 19s-6.5-4.1-6.5-8.2A3.4 3.4 0 0 1 12 8a3.4 3.4 0 0 1 6.5 2.8C18.5 14.9 12 19 12 19Z" />,
  card: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17" />
    </>
  ),
  doc: (
    <>
      <path d="M7 4.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V6A1.5 1.5 0 0 1 7 4.5Z" />
      <path d="M14 4.8V9h4.2M8 13h8M8 16h5" />
    </>
  ),
  chat: (
    <>
      <path d="M6 16.5 4 19V7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v6.2a2.5 2.5 0 0 1-2.5 2.5H6Z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  menu: <path d="M5 8h14M5 12h14M5 16h14" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 19c.9-3 3-4.5 6.5-4.5s5.6 1.5 6.5 4.5" />
    </>
  ),
};

export function Glyph({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name] ?? PATHS.spark}
    </svg>
  );
}

export function glyphFor(step: string, id: string): string {
  if (step === 'grade') return id === 'elementary' ? 'book' : id === 'middle' ? 'school' : 'cap';
  if (step === 'born' || step === 'nationality') return id === 'yes' ? 'check' : 'minus';
  if (step === 'goal') return id === 'study' ? 'cap' : 'briefcase';
  if (step === 'korean' || step === 'band') {
    if (id === 'beginner' || id === 'lower') return 'signal1';
    if (id === 'topik_3_4' || id === 'middle') return 'signal2';
    if (id === 'unknown') return 'help';
    return 'signal3';
  }
  if (step === 'parents') return id === 'both' ? 'people' : id === 'neither' ? 'minus' : 'person';
  if (step === 'type') return id === 'unsure' ? 'help' : 'person';
  if (step === 'region' || step === 'countries') return 'pin';
  if (step === 'school') return 'school';
  if (step === 'interests') {
    if (id === 'it') return 'chip';
    if (id === 'culinary') return 'pan';
    if (id === 'design') return 'pen';
    if (id === 'health') return 'heart';
    return 'briefcase';
  }
  if (step === 'support') {
    if (id === 'fees') return 'card';
    if (id === 'documents') return 'doc';
    if (id === 'interpretation') return 'chat';
    if (id === 'counseling') return 'heart';
    if (id === 'korean_class') return 'chat';
    return 'briefcase';
  }
  return 'globe';
}

export function monogram(label: string): string {
  const trimmed = label.trim();
  const first = [...trimmed][0];
  return first ?? '·';
}
