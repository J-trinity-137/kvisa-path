import { useState } from 'react';
import type { SupportedLangCode } from '../kbridge';
import { FRESHNESS_COPY } from '../i18n/shellCopy';
import { speakText } from '../share/speak';

export function SpeakButton({ lang, text }: { lang: SupportedLangCode; text: string }) {
  const copy = FRESHNESS_COPY[lang];
  const [note, setNote] = useState<string | null>(null);
  return (
    <span className="kv-no-print">
      <button
        type="button"
        className="kb-chip"
        onClick={() => {
          const result = speakText(text, lang);
          setNote(result === 'ok' ? null : copy.noVoice);
        }}
      >
        {copy.readAloud}
      </button>
      {note ? <span className="kb-subtitle"> {note}</span> : null}
    </span>
  );
}
