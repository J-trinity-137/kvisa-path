import { STUDENT_TYPES, type StudentType } from '../data/studentType';
import type { SupportedLangCode } from '../kbridge';
import { STUDENT_TYPE_COPY } from '../i18n/studentTypeCopy';

export function StudentTypePicker({
  lang,
  value,
  onChange,
}: {
  lang: SupportedLangCode;
  value: StudentType | null;
  onChange: (value: StudentType) => void;
}) {
  const copy = STUDENT_TYPE_COPY[lang];
  return (
    <section className="kb-section" aria-label={copy.ask}>
      <h2 className="kb-section-title">{copy.ask}</h2>
      <p className="kb-subtitle">{copy.privateNote}</p>
      <div className="kb-row" role="group" aria-label={copy.ask}>
        {STUDENT_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className="kb-chip"
            aria-pressed={value === type}
            onClick={() => onChange(type)}
          >
            {copy.types[type]}
          </button>
        ))}
      </div>
      {value === 'domestic_multicultural' ? <p>{copy.domesticLead}</p> : null}
      {value === 'unsure' ? <p>{copy.unsureLead}</p> : null}
    </section>
  );
}
