import type { ReactNode } from 'react';
import { LANGUAGES } from './languages';
import type { SupportedLangCode } from './types';

export function ActionBar({
  primaryLabel,
  onPrimary,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
}: {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div className="kb-actionbar-wrap">
      <div className="kb-actionbar" role="region" aria-label="주요 작업">
        {secondaryLabel && onSecondary ? (
          <button type="button" className="kb-btn-secondary" onClick={onSecondary}>
            {secondaryLabel}
          </button>
        ) : null}
        <button type="button" className="kb-btn-primary" onClick={onPrimary} disabled={primaryDisabled}>
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}

export function LanguagePicker({
  open,
  currentLang,
  onSelect,
  onClose,
  title = '언어',
  closeLabel = '닫기',
}: {
  open: boolean;
  currentLang: SupportedLangCode;
  onSelect: (lang: SupportedLangCode) => void;
  onClose: () => void;
  title?: string;
  closeLabel?: string;
}) {
  if (!open) return null;
  return (
    <div className="kb-sheet-backdrop" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="kb-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="kb-header" style={{ padding: '16px 20px' }}>
          <strong style={{ fontSize: 16 }}>{title}</strong>
        </div>
        <div className="kb-sheet-body">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className="kb-chip"
              aria-pressed={lang.code === currentLang}
              onClick={() => {
                onSelect(lang.code);
                onClose();
              }}
            >
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
        <div className="kb-sheet-footer">
          <button type="button" className="kb-btn-secondary" onClick={onClose}>
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function speakKorean(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis is optional.
  }
}

export function SpeakCard({
  koreanText,
  nativeText,
  caption,
  speakLabel = '한국어 음성 재생',
}: {
  koreanText: string;
  nativeText: string;
  caption?: ReactNode;
  speakLabel?: string;
}) {
  return (
    <div className="kb-speak-card">
      {caption ? <span className="kb-tag">{caption}</span> : null}
      <p className="kb-speak-ko" style={{ marginTop: caption ? 8 : 0 }}>
        {koreanText}
      </p>
      <p className="kb-speak-native">{nativeText}</p>
      <div className="kb-row" style={{ marginTop: 14 }}>
        <button type="button" className="kb-chip" onClick={() => speakKorean(koreanText)}>
          {speakLabel}
        </button>
      </div>
    </div>
  );
}
