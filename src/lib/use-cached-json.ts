'use client';

import { useEffect, useState } from 'react';
import { cacheGet, cacheSet } from '@/lib/offline';

export function useCachedJson<T>(key: string, url: string) {
  const [data, setData] = useState<T[]>(() => cacheGet<T[]>(key) ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Request failed');
      const json = (await res.json()) as T[];
      setData(json);
      cacheSet(key, json);
    } catch {
      const cached = cacheGet<T[]>(key);
      if (cached) setData(cached);
      else setError('Could not load data. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, url]);

  return { data, loading, error, reload, setData };
}
