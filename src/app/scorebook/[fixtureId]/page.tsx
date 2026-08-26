'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Scorecard, formatScoreline } from '@/components/sports/scorecard';
import { cn } from '@/lib/utils';
import type { ScorebookResponse } from '@/types/cricket';

export default function PublicScorebookPage() {
  const params = useParams<{ fixtureId: string }>();
  const [book, setBook] = useState<ScorebookResponse | null>(null);
  const [side, setSide] = useState<'HVPS' | 'OPPOSITION'>('HVPS');

  useEffect(() => {
    void fetch(`/api/public/scorebook/${params.fixtureId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ScorebookResponse | null) => setBook(data));
  }, [params.fixtureId]);

  if (!book) {
    return (
      <main className="px-4 pt-8">
        <p className="text-sm text-muted-foreground">Loading scorecard…</p>
      </main>
    );
  }

  const hvps = book.innings.find((item) => item.battingSide === 'HVPS');
  const opposition = book.innings.find(
    (item) => item.battingSide === 'OPPOSITION'
  );
  const active = side === 'HVPS' ? hvps : opposition;

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <p className="pt-4 text-xs uppercase tracking-wide text-muted-foreground">
        Cricket scorecard
      </p>
      <h1 className="mt-1 text-2xl font-semibold">
        {book.fixture.team.name} vs {book.fixture.opponent}
      </h1>
      <Link href="/fixtures" className="mt-2 inline-block text-sm text-primary">
        All fixtures
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {(['HVPS', 'OPPOSITION'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setSide(value)}
            className={cn(
              'min-h-11 rounded-md border text-sm',
              side === value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card'
            )}
          >
            {value === 'HVPS' ? book.fixture.team.name : book.fixture.opponent}
            {value === 'HVPS' && hvps ? ` · ${formatScoreline(hvps)}` : ''}
            {value === 'OPPOSITION' && opposition
              ? ` · ${formatScoreline(opposition)}`
              : ''}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {active ? (
          <Scorecard innings={active} />
        ) : (
          <p className="text-sm text-muted-foreground">
            This innings has not been started yet.
          </p>
        )}
      </div>
    </main>
  );
}
