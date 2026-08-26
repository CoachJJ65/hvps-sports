'use client';

import { FixtureCard } from '@/components/sports/fixture-card';
import { useCachedJson } from '@/lib/use-cached-json';
import type { FixtureItem, SelectionItem } from '@/types/sports';
import { useState } from 'react';

export default function ResultsPage() {
  const { data: fixtures, loading } = useCachedJson<FixtureItem>(
    'fixtures',
    '/api/public/fixtures'
  );
  const [selections, setSelections] = useState<Record<string, SelectionItem[]>>(
    {}
  );
  const completed = fixtures.filter((fixture) => fixture.status === 'COMPLETED');

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
      <h1 className="pt-4 text-2xl font-semibold">Results</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Scores as coaches post them after the final whistle.
      </p>
      <section className="mt-4 space-y-3">
        {loading && completed.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading results…</p>
        ) : completed.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No completed matches yet.
          </p>
        ) : (
          completed.map((fixture) => (
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
