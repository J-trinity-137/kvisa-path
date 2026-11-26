export type AppRoute =
  | { name: 'tracks' }
  | { name: 'board'; id?: string }
  | { name: 'me' }
  | { name: 'onboarding' };

export function parseRoute(hash: string): AppRoute {
  const path = hash.replace(/^#/, '').replace(/^\//, '');
  if (path === 'me') return { name: 'me' };
  if (path === 'onboarding') return { name: 'onboarding' };
  if (path === 'board') return { name: 'board' };
  if (path.startsWith('board/')) return { name: 'board', id: decodeURIComponent(path.slice('board/'.length)) };
  return { name: 'tracks' };
}

export function routeHash(route: AppRoute): string {
  if (route.name === 'me') return '#/me';
  if (route.name === 'onboarding') return '#/onboarding';
  if (route.name === 'board') return route.id ? `#/board/${encodeURIComponent(route.id)}` : '#/board';
  return '#/tracks';
}
