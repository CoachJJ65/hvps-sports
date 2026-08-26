'use client';

import { useMemo, useState } from 'react';
import { FixtureCard } from '@/components/sports/fixture-card';
import { useCachedJson } from '@/lib/use-cached-json';
import { cn } from '@/lib/utils';
import type { FixtureItem, SelectionItem } from '@/types/sports';

export default function FixturesPage() {
  const { data: fixtures, loading } = useCachedJson<FixtureItem>(
    'fixtures',
    '/api/public/fixtures'
  );
  const [filter, setFilter] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');
  const [sport, setSport] = useState('ALL');
  const [selections, setSelections] = useState<Record<string, SelectionItem[]>>(
    {}
  );

  const sports = useMemo(
    () => Array.from(new Set(fixtures.map((f) => f.team.sport.name))).sort(),
    [fixtures]
  );

  const filtered = fixtures.filter((fixture) => {
    const completed = fixture.status === 'COMPLETED';
    if (filter === 'UPCOMING' && completed) return false;
    if (filter === 'COMPLETED' && !completed) return false;
    if (sport !== 'ALL' && fixture.team.sport.name !== sport) return false;
    return true;
  });

  async function loadSelections(fixtureId: string) {
    if (selections[fixtureId]) return;
    try {
      const res = await fetch(`/api/public/selections/${fixtureId}`);
      if (!res.ok) return;
      const json = (await res.json()) as SelectionItem[];
      setSelections((prev) => ({ ...prev, [fixtureId]: json }));
    } catch {
      setSelections((prev) => ({ ...prev, [fixtureId]: [] }));
    }
  }

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <h1 className="pt-4 text-2xl font-semibold">Fixtures</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Match times, venues, bus departures, and team sheets.
      </p>

      <div className="mt-4 flex gap-2">
        {(['UPCOMING', 'COMPLETED'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              'min-h-11 flex-1 rounded-md border text-sm',
              filter === value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card'
            )}
          >
            {value === 'UPCOMING' ? 'Upcoming' : 'Completed'}
          </button>
        ))}
      </div>

      {sports.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterChip
            label="All sports"
            active={sport === 'ALL'}
            onClick={() => setSport('ALL')}
          />
          {sports.map((name) => (
            <FilterChip
              key={name}
              label={name}
              active={sport === name}
              onClick={() => setSport(name)}
            />
          ))}
        </div>
      ) : null}

      <section className="mt-4 space-y-3">
        {loading && filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading fixtures…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No {filter.toLowerCase()} fixtures yet.
          </p>
        ) : (
          filtered.map((fixture) => (
            <FixtureCard
              key={fixture.id}
              fixture={fixture}
              selections={selections[fixture.id]}
              onExpand={loadSelections}
            />
          ))
        )}
      </section>
    </main>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-11 shrink-0 rounded-full border px-4 text-sm',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card'
      )}
    >
      {label}
    </button>
  );
}
