'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScorePad } from '@/components/sports/score-pad';
import { formatScoreline } from '@/components/sports/scorecard';
import { isStaff } from '@/lib/role-names';
import { cn } from '@/lib/utils';
import type { PlayerItem, TeamItem } from '@/types/sports';
import type { ScorebookInnings, ScorebookResponse } from '@/types/cricket';

export default function CoachScorebookPage() {
  const params = useParams<{ fixtureId: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [book, setBook] = useState<ScorebookResponse | null>(null);
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [side, setSide] = useState<'HVPS' | 'OPPOSITION'>('HVPS');

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin');
    if (status === 'authenticated' && !isStaff(session?.user?.role)) {
      router.replace('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    void fetch(`/api/public/scorebook/${params.fixtureId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ScorebookResponse | null) => {
        if (data) setBook(data);
      });
    void fetch('/api/public/teams')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TeamItem[]) => setTeams(data));
  }, [params.fixtureId]);

  if (!book) {
    return (
      <main className="px-4 pt-8">
        <p className="text-sm text-muted-foreground">Loading scorebook…</p>
      </main>
    );
  }

  const squad =
    teams.find((team) => team.id === book.fixture.teamId)?.players ??
    book.fixture.team.players ??
    [];
  const hvps = book.innings.find((item) => item.battingSide === 'HVPS');
  const opposition = book.innings.find(
    (item) => item.battingSide === 'OPPOSITION'
  );
  const active: ScorebookInnings | undefined =
    side === 'HVPS' ? hvps : opposition;

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <p className="pt-4 text-xs uppercase tracking-wide text-muted-foreground">
        Cricket scorebook
      </p>
      <h1 className="mt-1 text-2xl font-semibold">
        {book.fixture.team.name} vs {book.fixture.opponent}
      </h1>
      <p className="text-sm text-muted-foreground">
        Each HVPS team has its own book for this match.
      </p>
      <Link href="/coach" className="mt-2 inline-block text-sm text-primary">
        Back to coach room
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
          <ScorePad
            innings={active}
            squad={side === 'HVPS' ? squad : []}
            opposition={book.fixture.opponent}
            onUpdate={setBook}
          />
        ) : (
          <StartInningsForm
            fixtureId={book.fixture.id}
            battingSide={side}
            squad={side === 'HVPS' ? squad : []}
            bowlingSquad={side === 'HVPS' ? [] : squad}
            battingLabel={
              side === 'HVPS' ? book.fixture.team.name : book.fixture.opponent
            }
            bowlingLabel={
              side === 'HVPS' ? book.fixture.opponent : book.fixture.team.name
            }
            onStarted={setBook}
          />
        )}
      </div>
    </main>
  );
}

function StartInningsForm({
  fixtureId,
  battingSide,
  squad,
  bowlingSquad,
  battingLabel,
  bowlingLabel,
  onStarted,
}: {
  fixtureId: string;
  battingSide: 'HVPS' | 'OPPOSITION';
  squad: PlayerItem[];
  bowlingSquad: PlayerItem[];
  battingLabel: string;
  bowlingLabel: string;
  onStarted: (book: ScorebookResponse) => void;
}) {
  const [oversLimit, setOversLimit] = useState(20);
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!striker.trim() || !nonStriker.trim() || !bowler.trim()) {
      toast.error('Openers and the first bowler are required');
      return;
    }
    const res = await fetch('/api/coach/scorebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fixtureId,
        battingSide,
        oversLimit,
        striker: { name: striker.trim() },
        nonStriker: { name: nonStriker.trim() },
        bowler: { name: bowler.trim() },
      }),
    });
    const data = (await res.json()) as ScorebookResponse & { error?: string };
    if (!res.ok) {
      toast.error(data.error ?? 'Could not start innings');
      return;
    }
    onStarted(data);
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="space-y-3 rounded-xl border border-border bg-card p-4"
    >
      <h2 className="font-medium">Start {battingLabel} innings</h2>
      <label className="block text-sm">
        Overs
        <select
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={oversLimit}
          onChange={(event) => setOversLimit(Number(event.target.value))}
        >
          {[8, 10, 15, 20, 25, 30].map((n) => (
            <option key={n} value={n}>
              {n} overs
            </option>
          ))}
        </select>
      </label>
      <NameField
        label="Striker"
        value={striker}
        onChange={setStriker}
        suggestions={squad}
      />
      <NameField
        label="Non-striker"
        value={nonStriker}
        onChange={setNonStriker}
        suggestions={squad}
      />
      <NameField
        label={`${bowlingLabel} opening bowler`}
        value={bowler}
        onChange={setBowler}
        suggestions={bowlingSquad}
      />
      <Button type="submit" className="w-full">
        Open scorebook
      </Button>
    </form>
  );
}

function NameField({
  label,
  value,
  onChange,
  suggestions,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: PlayerItem[];
}) {
  return (
    <label className="block text-sm">
      {label}
      {suggestions.length > 0 ? (
        <select
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={suggestions.some(
            (p) => `${p.firstName} ${p.lastName}` === value
          )
            ? value
            : ''}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Type a name below</option>
          {suggestions.map((player) => {
            const name = `${player.firstName} ${player.lastName}`;
            return (
              <option key={player.id} value={name}>
                {name}
              </option>
            );
          })}
        </select>
      ) : null}
      <input
        className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}
