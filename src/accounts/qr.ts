import { create } from 'qrcode';

export function qrModules(text: string): { size: number; cells: boolean[] } {
  const qr = create(text, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size;
  const cells: boolean[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) cells.push(qr.modules.get(row, col) === 1);
  }
  return { size, cells };
}

/** Local SVG. No image host. */
export function qrSvgPath(text: string): { size: number; d: string } {
  const { size, cells } = qrModules(text);
  const quiet = 2;
  const d = cells
    .map((on, index) => {
      if (!on) return '';
      const x = (index % size) + quiet;
      const y = Math.floor(index / size) + quiet;
      return `M${x} ${y}h1v1h-1z`;
    })
    .join('');
  return { size: size + quiet * 2, d };
}
