import type { SupportedLangCode } from '../../kbridge';
import { languageMeta } from '../../kbridge';

export function formatWhen(iso: string, lang: SupportedLangCode): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const locale = languageMeta(lang).locale;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function formatDay(isoDate: string, lang: SupportedLangCode): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(languageMeta(lang).locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}
