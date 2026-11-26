import { useMemo } from 'react';
import type { SupportedLangCode } from '../kbridge';
import { boardPosts } from '../data/board';
import { BoardView } from './BoardView';

/** Own module so the board tables load only when the board route opens. */
export function BoardPage({
  lang,
  selectedId,
  onOpen,
  onClose,
}: {
  lang: SupportedLangCode;
  selectedId?: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const posts = useMemo(() => boardPosts(), []);
  return <BoardView lang={lang} posts={posts} selectedId={selectedId} onOpen={onOpen} onClose={onClose} />;
}
