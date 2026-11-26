import { languageMeta } from '../kbridge';
import type { SupportedLangCode } from '../kbridge';

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

/** Reads text with the browser voice. No network request. */
export function speakText(text: string, lang: SupportedLangCode): 'ok' | 'unsupported' {
  if (!canSpeak() || !text.trim()) return 'unsupported';
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languageMeta(lang).locale;
  window.speechSynthesis.speak(utterance);
  return 'ok';
}
