export const STUDENT_TYPES = ['foreign_family', 'mid_entry', 'domestic_multicultural', 'unsure'] as const;

export type StudentType = (typeof STUDENT_TYPES)[number];

/** Device preference, same idea as the language key. Never copied into events. */
export const STUDENT_TYPE_KEY = 'kvisa-path.studentType';

export function isStudentType(value: string | null): value is StudentType {
  return value !== null && (STUDENT_TYPES as readonly string[]).includes(value);
}

export function readStudentType(): StudentType | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STUDENT_TYPE_KEY);
  return isStudentType(raw) ? raw : null;
}

export function writeStudentType(value: StudentType): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STUDENT_TYPE_KEY, value);
}
