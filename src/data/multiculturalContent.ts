import rows from './sources/multicultural.json';

export interface MulticulturalFact {
  id: string;
  category: string;
  name: string;
  status: 'verified' | 'partial' | 'not_found';
  sourceType: string;
  text: string;
  sourceUrl: string;
  verifiedAt: string;
  press: boolean;
}

interface RawFact {
  category: string;
  name: string;
  eligibility?: string;
  details?: string;
  quote?: string;
  source_url?: string;
  verified_at?: string;
  status?: string;
  source_type?: string;
  notes?: string;
}

function withoutMissing(text: string): string {
  return text
    .split(/(?<=[.。])\s*/)
    .map((part) => part.trim())
    .filter((part) => part && !/not_found/i.test(part))
    .join(' ');
}

function slug(name: string): string {
  return name.replace(/\s+/g, '-').slice(0, 48);
}

const SECTION_BY_CATEGORY: Record<string, MulticulturalFact['category']> = {
  scholarship: 'scholarships',
  school_support: 'school-supports',
  admission_highschool: 'school-supports',
  bilingual: 'bilingual-programs',
  career: 'bilingual-careers',
};

export const MULTICULTURAL_FACTS: readonly MulticulturalFact[] = (rows as RawFact[])
  .filter((row) => row.status === 'verified' || row.status === 'partial')
  .filter((row) => row.category !== 'meta' && row.category !== 'admission')
  .map((row) => {
    const text =
      row.status === 'partial'
        ? withoutMissing(row.quote ?? '')
        : withoutMissing([row.eligibility, row.details, row.quote].filter(Boolean).join(' '));
    return {
      id: slug(row.name),
      category: SECTION_BY_CATEGORY[row.category] ?? row.category,
      name: row.name,
      status: row.status as 'verified' | 'partial',
      sourceType: row.source_type ?? 'official',
      text,
      sourceUrl: row.source_url ?? '',
      verifiedAt: row.verified_at ?? '',
      press: row.source_type === 'press_secondary',
    };
  })
  .filter((row) => row.text.length > 0 && row.sourceUrl.startsWith('https://'));

export function factsFor(sectionId: string): readonly MulticulturalFact[] {
  return MULTICULTURAL_FACTS.filter((fact) => fact.category === sectionId);
}

/** 2027 guides where a multicultural admission qualification was not in the eligibility list. */
export const NO_TRACK_2027: readonly MulticulturalFact[] = (rows as RawFact[])
  .filter((row) => row.status === 'not_found' && row.category === 'admission' && (row.source_url ?? '').startsWith('https://'))
  .map((row) => ({
    id: slug(row.name),
    category: 'no-track',
    name: row.name.replace(/ 2027.*/, ''),
    status: 'not_found' as const,
    sourceType: row.source_type ?? 'official',
    text: withoutMissing(row.quote ?? ''),
    sourceUrl: row.source_url ?? '',
    verifiedAt: row.verified_at ?? '',
    press: false,
  }));
