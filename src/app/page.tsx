'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { CalendarDays, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FixtureCard } from '@/components/sports/fixture-card';
import { NoticeCard } from '@/components/sports/notice-card';
import { useCachedJson } from '@/lib/use-cached-json';
import type { FixtureItem, NoticeItem, SelectionItem } from '@/types/sports';
import { useState } from 'react';

export default function HomePage() {
  const { data: session } = useSession();
  const { data: notices, loading: noticesLoading } = useCachedJson<NoticeItem>(
    'notices',
    '/api/public/notices'
  );
  const { data: fixtures, loading: fixturesLoading } =
    useCachedJson<FixtureItem>('fixtures', '/api/public/fixtures');
  const [selections, setSelections] = useState<Record<string, SelectionItem[]>>(
    {}
  );

  const upcoming = fixtures
    .filter((fixture) => fixture.status !== 'COMPLETED')
    .slice(0, 6);

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
    <main className="flex flex-1 flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="pt-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Hurlyvale Primary
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          HVPS Sports
        </h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Fixtures, team sheets, notices, and match-day planners for parents and
          coaches.
        </p>
      </header>

      <section className="mt-6 space-y-3" aria-label="Notices">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Notices
          </h2>
        </div>
        {noticesLoading && notices.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading notices…</p>
        ) : notices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notices yet.</p>
        ) : (
          notices.slice(0, 3).map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))
        )}
      </section>

      <section className="mt-8 space-y-3" aria-label="Upcoming fixtures">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Upcoming
          </h2>
          <Link href="/fixtures" className="text-sm text-primary">
            All fixtures
          </Link>
        </div>
        {fixturesLoading && upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading fixtures…</p>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming fixtures published.
          </p>
        ) : (
          upcoming.map((fixture) => (
            <FixtureCard
              key={fixture.id}
              fixture={fixture}
              selections={selections[fixture.id]}
              onExpand={loadSelections}
            />
          ))
        )}
      </section>

      <section className="mt-8 grid gap-3 pb-8" aria-label="Shortcuts">
        <Link
          href="/teams"
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
            <Users className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block font-medium">Teams</span>
            <span className="block text-sm text-muted-foreground">
              Rugby, Girls Touch, and Netball squads
            </span>
          </span>
        </Link>
        <Link
          href="/forms"
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
            <FileText className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block font-medium">Forms & planners</span>
            <span className="block text-sm text-muted-foreground">
              Tournament schedules, coaches planner, tag laws
            </span>
          </span>
        </Link>
        <Link
          href="/results"
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
            <CalendarDays className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block font-medium">Results</span>
            <span className="block text-sm text-muted-foreground">
              Completed matches and scores
            </span>
          </span>
        </Link>

        {session?.user ? (
          <Button asChild className="w-full">
            <Link
              href={
                ['ADMIN', 'HOD_SPORTS', 'HEAD_OF_SPORTS'].includes(
                  session.user.role
                )
                  ? '/admin'
                  : session.user.role === 'COACH'
                    ? '/coach'
                    : '/more'
              }
            >
              Open {session.user.role === 'PARENT' ? 'parent' : 'staff'} desk
            </Link>
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href="/auth/signin">Coach / parent sign in</Link>
          </Button>
        )}
      </section>
    </main>
  );
}
