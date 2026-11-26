export type AppRoute =
  | { name: 'tracks' }
  | { name: 'track'; id: string }
  | { name: 'compare' }
  | { name: 'deadlines' }
  | { name: 'board'; id?: string }
  | { name: 'me' }
  | { name: 'onboarding' };

export function parseRoute(hash: string): AppRoute {
  const path = hash.replace(/^#/, '').replace(/^\//, '');
  if (path === 'me') return { name: 'me' };
  if (path === 'onboarding') return { name: 'onboarding' };
  if (path === 'compare') return { name: 'compare' };
  if (path === 'deadlines') return { name: 'deadlines' };
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
  if (route.name === 'board') return route.id ? `#/board/${encodeURIComponent(route.id)}` : '#/board';
  return '#/tracks';
}
