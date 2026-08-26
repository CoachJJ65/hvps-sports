export interface OfflineRegister {
  id: string;
  teamId: string;
  date: string;
  records: Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'>;
}

const QUEUE_KEY = 'hvps_offline_registers';
const CACHE_PREFIX = 'hvps_cache_';

export function saveOfflineRegister(
  teamId: string,
  date: string,
  records: Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'>
): void {
  const queue = getOfflineRegisters();
  queue.push({
    id: Math.random().toString(36).slice(2, 9),
    teamId,
    date,
    records,
  });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function getOfflineRegisters(): OfflineRegister[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(QUEUE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as OfflineRegister[];
  } catch {
    return [];
  }
}

export function removeOfflineRegister(id: string): void {
  const filtered = getOfflineRegisters().filter((item) => item.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
}

export async function syncOfflineRegisters(
  onProgress?: (msg: string) => void
): Promise<{ success: boolean; syncedCount: number }> {
  const queue = getOfflineRegisters();
  if (queue.length === 0) return { success: true, syncedCount: 0 };

  let syncedCount = 0;
  for (const reg of queue) {
    try {
      onProgress?.('Syncing practice register…');
      const response = await fetch('/api/coach/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: reg.teamId,
          date: reg.date,
          records: reg.records,
        }),
      });

      if (response.ok) {
        removeOfflineRegister(reg.id);
        syncedCount += 1;
      }
    } catch {
      return { success: false, syncedCount };
    }
  }

  return { success: true, syncedCount };
}

export function cacheSet<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value));
}

export function cacheGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
