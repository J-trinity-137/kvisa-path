export type AppRoute =
  | { name: 'tracks' }
  | { name: 'track'; id: string }
  | { name: 'compare' }
  | { name: 'deadlines' }
  | { name: 'board'; id?: string }
  | { name: 'me' }
  | { name: 'onboarding' }
  | { name: 'accounts' }
  | { name: 'class' }
  | { name: 'join'; code?: string }
  | { name: 'family' };

export function parseRoute(hash: string): AppRoute {
  const path = hash.replace(/^#/, '').replace(/^\//, '');
  if (path === 'me') return { name: 'me' };
  if (path === 'onboarding') return { name: 'onboarding' };
  if (path === 'compare') return { name: 'compare' };
  if (path === 'deadlines' || path === 'schedule') return { name: 'deadlines' };
  if (path === 'accounts') return { name: 'accounts' };
  if (path === 'class') return { name: 'class' };
  if (path === 'family') return { name: 'family' };
  if (path === 'join') return { name: 'join' };
  if (path.startsWith('join/')) return { name: 'join', code: decodeURIComponent(path.slice('join/'.length)) };
  if (path.startsWith('j/')) return { name: 'join', code: decodeURIComponent(path.slice('j/'.length)) };
  if (path === 'board') return { name: 'board' };
  if (path.startsWith('board/')) return { name: 'board', id: decodeURIComponent(path.slice('board/'.length)) };
  if (path.startsWith('track/')) return { name: 'track', id: decodeURIComponent(path.slice('track/'.length)) };
  return { name: 'tracks' };
}

export function routeHash(route: AppRoute): string {
  if (route.name === 'me') return '#/me';
  if (route.name === 'onboarding') return '#/onboarding';
  if (route.name === 'compare') return '#/compare';
  if (route.name === 'deadlines') return '#/deadlines';
  if (route.name === 'track') return `#/track/${encodeURIComponent(route.id)}`;
  if (route.name === 'accounts') return '#/accounts';
  if (route.name === 'class') return '#/class';
  if (route.name === 'family') return '#/family';
  if (route.name === 'join') return route.code ? `#/j/${encodeURIComponent(route.code)}` : '#/join';
  if (route.name === 'board') return route.id ? `#/board/${encodeURIComponent(route.id)}` : '#/board';
  return '#/tracks';
}
