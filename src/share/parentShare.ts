/** User-started share. Nothing is written to localStorage. */
export async function shareOrCopy(text: string): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch {
      return 'failed';
    }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return 'copied';
  }
  return 'failed';
}

export function pageLink(): string {
  if (typeof window === 'undefined') return 'https://j-trinity-137.github.io/kvisa-path/';
  return window.location.origin + window.location.pathname;
}
