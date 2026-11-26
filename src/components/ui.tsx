import type { ReactNode } from 'react';
import { Glyph } from './icons';

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <div className="empty-mark" aria-hidden="true">
        <Glyph name="spark" />
      </div>
      <p>{title}</p>
      {action}
    </div>
  );
}
