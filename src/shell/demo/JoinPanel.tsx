import { useEffect, useRef, useState } from 'react';
import { DEMO_BANNER } from '../../accounts/model';
import { extractJoinCode } from '../../accounts/codes';
import { accountsCopy } from '../../i18n/accountsCopy';
import type { SupportedLangCode } from '../../kbridge';

type Detector = { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>> };

function barcodeDetector(): (new (options: { formats: string[] }) => Detector) | null {
  const host = window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => Detector };
  return host.BarcodeDetector ?? null;
}

export function JoinPanel({
  lang,
  initialCode,
  rows,
  error,
  onJoin,
}: {
  lang: SupportedLangCode;
  initialCode: string;
  rows: { id: string; name: string; status: 'pending' | 'active' }[];
  error: string | null;
  onJoin: (code: string) => void;
}) {
  const copy = accountsCopy(lang);
  const [code, setCode] = useState(initialCode);
  const [scanning, setScanning] = useState(false);
  const [scanNote, setScanNote] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const joinRef = useRef(onJoin);
  joinRef.current = onJoin;

  useEffect(() => {
    if (!scanning) return;
    const Ctor = barcodeDetector();
    const video = videoRef.current;
    if (!Ctor || !video || !navigator.mediaDevices?.getUserMedia) {
      setScanNote(copy.scanUnavailable);
      setScanning(false);
      return;
    }
    let timer = 0;
    let stream: MediaStream | null = null;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(async (next) => {
        if (cancelled) {
          next.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = next;
        video.srcObject = next;
        await video.play();
        const detector = new Ctor({ formats: ['qr_code'] });
        timer = window.setInterval(() => {
          detector
            .detect(video)
            .then((found) => {
              const hit = found.map((item) => extractJoinCode(item.rawValue ?? '')).find((item): item is string => Boolean(item));
              if (!hit) return;
              setCode(hit);
              setScanning(false);
              joinRef.current(hit);
            })
            .catch(() => undefined);
        }, 500);
      })
      .catch(() => {
        if (!cancelled) {
          setScanNote(copy.scanUnavailable);
          setScanning(false);
        }
      });
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      stream?.getTracks().forEach((track) => track.stop());
      if (video.srcObject) video.srcObject = null;
    };
  }, [scanning, copy.scanUnavailable]);

  return (
    <section className="panel demo-panel">
      <p className="demo-banner">
        <bdi dir="ltr">{DEMO_BANNER}</bdi>
      </p>
      <h1>{copy.joinTitle}</h1>
      <p>{copy.joinLead}</p>
      {error ? (
        <p role="alert" className="soft">
          {error}
        </p>
      ) : null}
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          onJoin(code);
        }}
      >
        <label className="field">
          {copy.code}
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            dir="ltr"
            spellCheck={false}
            autoCapitalize="characters"
            autoComplete="off"
            maxLength={80}
          />
        </label>
        <div className="setup-actions">
          <button type="submit" className="btn primary">
            {copy.join}
          </button>
          {scanning ? (
            <button type="button" className="btn ghost" onClick={() => setScanning(false)}>
              {copy.stopScan}
            </button>
          ) : (
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setScanNote(null);
                if (!barcodeDetector() || !navigator.mediaDevices?.getUserMedia) {
                  setScanNote(copy.scanUnavailable);
                  return;
                }
                setScanning(true);
              }}
            >
              {copy.scan}
            </button>
          )}
        </div>
      </form>
      {scanNote ? <p role="status">{scanNote}</p> : null}
      {scanning ? <video ref={videoRef} className="scan-video" muted playsInline aria-label={copy.scan} /> : null}
      <ul className="stack">
        {rows.map((row) => (
          <li key={row.id}>
            <bdi>{row.name}</bdi> · {row.status === 'pending' ? copy.waitingTeacher : copy.inClass}
          </li>
        ))}
      </ul>
    </section>
  );
}
