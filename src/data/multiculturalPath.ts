/**
 * Sections waiting for verified rows. An empty itemIds list stays off the screen.
 * Add a row only after a source URL and checked date exist.
 */
export interface MulticulturalSection {
  id: 'school-supports' | 'bilingual-programs' | 'bilingual-careers' | 'scholarships';
  itemIds: readonly string[];
}

export const MULTICULTURAL_SECTIONS: readonly MulticulturalSection[] = [
  { id: 'school-supports', itemIds: [] },
  { id: 'bilingual-programs', itemIds: [] },
  { id: 'bilingual-careers', itemIds: [] },
  { id: 'scholarships', itemIds: [] },
];
