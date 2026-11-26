import { useCallback, useEffect, useState } from 'react';
import { persistDemo, readDemo, readDemoFromIndexedDb, DEMO_STORAGE_KEY } from './persist';
import type { DemoDb } from './model';

export function useDemo(): {
  db: DemoDb;
  replace: (recipe: DemoDb | ((prev: DemoDb) => DemoDb)) => void;
} {
  const [db, setDb] = useState<DemoDb>(() => readDemo());
  const replace = useCallback((recipe: DemoDb | ((prev: DemoDb) => DemoDb)) => {
    setDb((prev) => {
      const next = typeof recipe === 'function' ? recipe(prev) : recipe;
      persistDemo(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || window.localStorage.getItem(DEMO_STORAGE_KEY)) return;
    let gone = false;
    readDemoFromIndexedDb().then((stored) => {
      if (gone || !stored) return;
      if (stored.accounts.length === 0 && stored.classes.length === 0) return;
      persistDemo(stored);
      setDb(stored);
    });
    return () => {
      gone = true;
    };
  }, []);

  return { db, replace };
}
