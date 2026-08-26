'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isCricketSport } from '@/lib/cricket';
import { isStaff } from '@/lib/role-names';
import { formatMatchDate } from '@/lib/format';
import { useCachedJson } from '@/lib/use-cached-json';
import type { FixtureItem } from '@/types/sports';

export default function CoachScorebookIndexPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: fixtures, loading } = useCachedJson<FixtureItem>(
    'fixtures',
    '/api/public/fixtures'
  );

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin');
    if (status === 'authenticated' && !isStaff(session?.user?.role)) {
      router.replace('/');
    }
  }, [status, session, router]);

  const cricket = fixtures.filter((fixture) =>
    isCricketSport(fixture.team.sport.name)
  );

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <h1 className="pt-4 text-2xl font-semibold">Cricket scorebooks</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Open a book for the HVPS team that is playing. Each match has batting
        and bowling cards for both innings.
      </p>
      <ul className="mt-4 space-y-3">
        {loading && cricket.length === 0 ? (
          <li className="text-sm text-muted-foreground">Loading fixtures…</li>
        ) : cricket.length === 0 ? (
          <li className="text-sm text-muted-foreground">
            No cricket fixtures yet.
          </li>
        ) : (
          cricket.map((fixture) => (
            <li key={fixture.id}>
              <Link
                href={`/coach/scorebook/${fixture.id}`}
                className="block rounded-xl border border-border bg-card p-4"
              >
                <p className="text-[11px] uppercase text-muted-foreground">
                  {fixture.team.name}
                </p>
                <p className="font-medium">vs {fixture.opponent}</p>
                <p className="text-sm text-muted-foreground">
                  {formatMatchDate(fixture.dateTime)}
                  {fixture.cricket?.hvps
                    ? ` · ${fixture.cricket.hvps.runs}/${fixture.cricket.hvps.wickets}`
                    : ''}
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
