import { factsFor } from './multiculturalContent';

/**
 * Sections render only when they have verified rows.
 */
export interface MulticulturalSection {
  id: 'school-supports' | 'bilingual-programs' | 'bilingual-careers' | 'scholarships';
  itemIds: readonly string[];
}

const IDS = ['school-supports', 'bilingual-programs', 'bilingual-careers', 'scholarships'] as const;

export const MULTICULTURAL_SECTIONS: readonly MulticulturalSection[] = IDS.map((id) => ({
  id,
  itemIds: factsFor(id).map((fact) => fact.id),
}));
