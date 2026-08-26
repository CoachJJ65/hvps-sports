'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bus, ChevronDown, MapPin, NotebookPen } from 'lucide-react';
import { formatMatchDate, formatTime, playerName } from '@/lib/format';
import { isCricketSport } from '@/lib/cricket';
import { cn } from '@/lib/utils';
import type { FixtureItem, SelectionItem } from '@/types/sports';

export function FixtureCard({
  fixture,
  selections,
  onExpand,
}: {
  fixture: FixtureItem;
  selections?: SelectionItem[];
  onExpand?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const completed = fixture.status === 'COMPLETED';
  const cricket = isCricketSport(fixture.team.sport.name);
  const hvpsScore = fixture.isAway ? fixture.awayScore : fixture.homeScore;
  const oppScore = fixture.isAway ? fixture.homeScore : fixture.awayScore;
  const cricketLine = fixture.cricket?.hvps
    ? `${fixture.cricket.hvps.runs}/${fixture.cricket.hvps.wickets} (${fixture.cricket.hvps.overs})`
    : null;

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next) onExpand?.(fixture.id);
  }

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {fixture.team.sport.name} · {fixture.team.name}
          </p>
          <h2 className="mt-0.5 text-base font-semibold leading-snug">
            {fixture.isAway ? `vs ${fixture.opponent}` : `vs ${fixture.opponent}`}
            <span className="ml-2 text-xs font-medium text-primary">
              {fixture.isAway ? 'Away' : 'Home'}
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatMatchDate(fixture.dateTime)}
          </p>
        </div>
        {cricket && cricketLine ? (
          <p className="shrink-0 rounded-lg bg-secondary px-2.5 py-1 text-sm font-semibold tabular-nums">
            {cricketLine}
          </p>
        ) : completed && hvpsScore != null && oppScore != null ? (
          <p className="shrink-0 rounded-lg bg-secondary px-2.5 py-1 text-sm font-semibold tabular-nums">
            {hvpsScore}–{oppScore}
          </p>
        ) : (
          <p className="shrink-0 text-[11px] uppercase text-muted-foreground">
            {fixture.status.toLowerCase()}
          </p>
        )}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-3.5" aria-hidden />
        {fixture.location}
      </p>
      {fixture.busTime ? (
        <p className="mt-1 flex items-center gap-1.5 text-sm text-primary">
          <Bus className="size-3.5" aria-hidden />
          Bus {formatTime(fixture.busTime)}
        </p>
      ) : null}
      {fixture.notes ? (
        <p className="mt-2 text-sm text-muted-foreground">{fixture.notes}</p>
      ) : null}

      {cricket ? (
        <Link
          href={`/scorebook/${fixture.id}`}
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-1 rounded-md border border-border text-sm"
        >
          <NotebookPen className="size-4" aria-hidden />
          Scorebook
        </Link>
      ) : null}

      <button
        type="button"
        onClick={toggle}
        className="mt-3 flex min-h-11 w-full items-center justify-center gap-1 rounded-md border border-border text-sm"
      >
        Team sheet
        <ChevronDown
          className={cn('size-4 transition', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open ? (
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
          {selections && selections.length > 0 ? (
            selections.map((sel) => (
              <li
                key={sel.id}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span>{playerName(sel.player)}</span>
                <span className="text-muted-foreground">
                  {sel.position ?? 'Unassigned'}
                </span>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {selections ? 'No team sheet published yet.' : 'Loading team sheet…'}
            </li>
          )}
        </ul>
      ) : null}
    </article>
  );
}
