'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormViewer } from '@/components/sports/form-viewer';
import { isStaff } from '@/lib/role-names';
import {
  getOfflineRegisters,
  saveOfflineRegister,
  syncOfflineRegisters,
} from '@/lib/offline';
import { useCachedJson } from '@/lib/use-cached-json';
import { playerName } from '@/lib/format';
import { cn } from '@/lib/utils';
import { isCricketSport } from '@/lib/cricket';
import type {
  AttendanceMark,
  FixtureItem,
  FormItem,
  TeamItem,
} from '@/types/sports';

type Tab = 'ATTENDANCE' | 'RESULTS' | 'NOTICES' | 'FORMS';

export default function CoachPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('ATTENDANCE');
  const [online, setOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const [queued, setQueued] = useState(0);

  const { data: teams } = useCachedJson<TeamItem>('teams', '/api/public/teams');
  const { data: fixtures, reload: reloadFixtures } = useCachedJson<FixtureItem>(
    'fixtures',
    '/api/public/fixtures'
  );
  const { data: forms } = useCachedJson<FormItem>(
    'forms',
    '/api/public/forms'
  );

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin');
    if (status === 'authenticated' && !isStaff(session?.user?.role)) {
      router.replace('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    const on = () => {
      setOnline(true);
      void syncOfflineRegisters().then((res) => {
        setQueued(getOfflineRegisters().length);
        if (res.syncedCount) {
          toast.success(`Synced ${res.syncedCount} offline registers`);
        }
      });
    };
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    setQueued(getOfflineRegisters().length);
    if (navigator.onLine) void syncOfflineRegisters();
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (status !== 'authenticated' || !isStaff(session?.user?.role)) {
    return (
      <main className="px-4 pt-8">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </main>
    );
  }

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <h1 className="pt-4 text-2xl font-semibold">Coach room</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {session.user.name}
        {!online ? ' · offline — registers will queue' : ''}
        {queued > 0 ? ` · ${queued} queued` : ''}
      </p>

      {fixtures.some((fixture) => isCricketSport(fixture.team.sport.name)) ? (
        <Link
          href="/coach/scorebook"
          className="mt-4 flex min-h-11 items-center justify-center rounded-xl border border-primary/40 bg-card text-sm font-medium"
        >
          Cricket scorebooks
        </Link>
      ) : null}

      <div className="mt-4 grid grid-cols-4 gap-1">
        {(['ATTENDANCE', 'RESULTS', 'NOTICES', 'FORMS'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              'min-h-11 rounded-md border px-1 text-[11px] font-medium',
              tab === value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card'
            )}
          >
            {value === 'ATTENDANCE'
              ? 'Register'
              : value === 'RESULTS'
                ? 'Results'
                : value === 'NOTICES'
                  ? 'Notices'
                  : 'Forms'}
          </button>
        ))}
      </div>

      {tab === 'ATTENDANCE' ? (
        <AttendancePanel teams={teams} online={online} onQueued={setQueued} />
      ) : null}
      {tab === 'RESULTS' ? (
        <ResultsPanel fixtures={fixtures} teams={teams} onSaved={reloadFixtures} />
      ) : null}
      {tab === 'NOTICES' ? <NoticesPanel /> : null}
      {tab === 'FORMS' ? <FormsPanel forms={forms} /> : null}
    </main>
  );
}

function AttendancePanel({
  teams,
  online,
  onQueued,
}: {
  teams: TeamItem[];
  online: boolean;
  onQueued: (count: number) => void;
}) {
  const [teamId, setTeamId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<Record<string, AttendanceMark>>({});
  const team = teams.find((item) => item.id === teamId);

  useEffect(() => {
    if (!teamId && teams[0]) setTeamId(teams[0].id);
  }, [teamId, teams]);

  useEffect(() => {
    if (!team) return;
    const next: Record<string, AttendanceMark> = {};
    for (const player of team.players) next[player.id] = 'PRESENT';
    setRecords(next);
  }, [team]);

  async function save() {
    if (!teamId) return;
    const payload = { teamId, date, records };
    if (!online) {
      saveOfflineRegister(teamId, date, records);
      onQueued(getOfflineRegisters().length);
      toast.message('Saved offline. Will sync when you are back online.');
      return;
    }
    const res = await fetch('/api/coach/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) toast.success('Register saved');
    else toast.error('Could not save register');
  }

  return (
    <section className="mt-4 space-y-3">
      <label className="block text-sm font-medium">
        Team
        <select
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={teamId}
          onChange={(event) => setTeamId(event.target.value)}
        >
          {teams.map((item) => (
            <option key={item.id} value={item.id}>
              {item.sport.name} · {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Date
        <input
          type="date"
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {team?.players.map((player) => (
          <li key={player.id} className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="text-sm">{playerName(player)}</span>
            <select
              className="min-h-11 rounded-md border border-input bg-background px-2 text-sm"
              value={records[player.id] ?? 'PRESENT'}
              onChange={(event) =>
                setRecords((prev) => ({
                  ...prev,
                  [player.id]: event.target.value as AttendanceMark,
                }))
              }
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="EXCUSED">Excused</option>
            </select>
          </li>
        ))}
      </ul>
      <Button className="w-full" onClick={() => void save()}>
        Save register
      </Button>
    </section>
  );
}

function ResultsPanel({
  fixtures,
  teams,
  onSaved,
}: {
  fixtures: FixtureItem[];
  teams: TeamItem[];
  onSaved: () => void;
}) {
  const openFixtures = fixtures.filter((f) => f.status !== 'COMPLETED');
  const [fixtureId, setFixtureId] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [statusValue, setStatusValue] = useState<'SCHEDULED' | 'ONGOING' | 'COMPLETED'>(
    'COMPLETED'
  );
  const [notes, setNotes] = useState('');
  const [squad, setSquad] = useState<Record<string, string>>({});

  const fixture = openFixtures.find((item) => item.id === fixtureId);
  const team = useMemo(
    () => teams.find((item) => item.id === fixture?.teamId),
    [teams, fixture]
  );

  useEffect(() => {
    if (!fixtureId && openFixtures[0]) setFixtureId(openFixtures[0].id);
  }, [fixtureId, openFixtures]);

  useEffect(() => {
    if (!fixtureId) return;
    fetch(`/api/public/selections/${fixtureId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: { playerId: string; position: string | null }[]) => {
        const next: Record<string, string> = {};
        for (const row of rows) next[row.playerId] = row.position ?? '';
        setSquad(next);
      })
      .catch(() => setSquad({}));
  }, [fixtureId]);

  async function saveResult(event: FormEvent) {
    event.preventDefault();
    if (!fixtureId) return;
    const res = await fetch(`/api/coach/fixtures/${fixtureId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        homeScore: homeScore === '' ? null : Number(homeScore),
        awayScore: awayScore === '' ? null : Number(awayScore),
        status: statusValue,
        notes,
      }),
    });
    if (!res.ok) {
      toast.error('Could not update fixture');
      return;
    }
    const selections = Object.entries(squad)
      .filter(([, position]) => position !== undefined)
      .map(([playerId, position]) => ({
        playerId,
        position: position || null,
      }));
    await fetch('/api/coach/selections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fixtureId, selections }),
    });
    toast.success('Match updated');
    onSaved();
  }

  function togglePlayer(playerId: string) {
    setSquad((prev) => {
      const next = { ...prev };
      if (playerId in next) delete next[playerId];
      else next[playerId] = '';
      return next;
    });
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={(event) => void saveResult(event)}>
      <label className="block text-sm font-medium">
        Fixture
        <select
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={fixtureId}
          onChange={(event) => setFixtureId(event.target.value)}
        >
          {openFixtures.map((item) => (
            <option key={item.id} value={item.id}>
              {item.team.sport.name} · {item.team.name} vs {item.opponent}
            </option>
          ))}
        </select>
      </label>
      {fixture && isCricketSport(fixture.team.sport.name) ? (
        <Button asChild className="w-full">
          <Link href={`/coach/scorebook/${fixture.id}`}>
            Open cricket scorebook
          </Link>
        </Button>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">
          Home
          <input
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
            inputMode="numeric"
            value={homeScore}
            onChange={(event) => setHomeScore(event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          Away
          <input
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
            inputMode="numeric"
            value={awayScore}
            onChange={(event) => setAwayScore(event.target.value)}
          />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Status
        <select
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={statusValue}
          onChange={(event) =>
            setStatusValue(event.target.value as typeof statusValue)
          }
        >
          <option value="SCHEDULED">Scheduled</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Notes
        <textarea
          className="mt-1 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>
      <div>
        <p className="text-sm font-medium">Team sheet</p>
        <ul className="mt-2 divide-y divide-border rounded-xl border border-border bg-card">
          {team?.players.map((player) => {
            const selected = player.id in squad;
            return (
              <li key={player.id} className="flex items-center gap-2 px-3 py-2">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => togglePlayer(player.id)}
                  className="size-5"
                />
                <span className="flex-1 text-sm">{playerName(player)}</span>
                {selected ? (
                  <input
                    className="min-h-11 w-32 rounded-md border border-input bg-background px-2 text-sm"
                    placeholder="Position"
                    value={squad[player.id] ?? ''}
                    onChange={(event) =>
                      setSquad((prev) => ({
                        ...prev,
                        [player.id]: event.target.value,
                      }))
                    }
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
      <Button className="w-full" type="submit">
        Save match
      </Button>
    </form>
  );
}

function NoticesPanel() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('GENERAL');

  async function publish(event: FormEvent) {
    event.preventDefault();
    const res = await fetch('/api/coach/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, type }),
    });
    if (res.ok) {
      toast.success('Notice published');
      setTitle('');
      setContent('');
    } else {
      toast.error('Could not publish notice');
    }
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={(event) => void publish(event)}>
      <label className="block text-sm font-medium">
        Title
        <input
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm font-medium">
        Type
        <select
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="GENERAL">General</option>
          <option value="WEATHER">Weather</option>
          <option value="LIGHTNING">Lightning</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea
          className="mt-1 min-h-28 w-full rounded-md border border-input bg-background px-3 py-2"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
      </label>
      <Button className="w-full" type="submit">
        Publish notice
      </Button>
    </form>
  );
}

function FormsPanel({ forms }: { forms: FormItem[] }) {
  const [selected, setSelected] = useState<FormItem | null>(null);
  if (selected) {
    return (
      <div className="mt-4">
        <FormViewer form={selected} onClose={() => setSelected(null)} />
      </div>
    );
  }
  return (
    <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
      {forms.map((form) => (
        <li key={form.id}>
          <button
            type="button"
            className="block min-h-14 w-full px-4 py-4 text-left"
            onClick={() => setSelected(form)}
          >
            <span className="block font-medium">{form.title}</span>
            <span className="block text-sm text-muted-foreground">
              {form.type.replaceAll('_', ' ')}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
