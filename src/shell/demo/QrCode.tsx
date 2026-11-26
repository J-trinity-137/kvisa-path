import { qrSvgPath } from '../../accounts/qr';

export function QrCode({ text, label }: { text: string; label: string }) {
  const { size, d } = qrSvgPath(text);
  return (
    <svg className="qr" role="img" aria-label={label} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#ffffff" />
      <path d={d} fill="#111111" />
    </svg>
  );
}
