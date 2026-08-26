'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Scorecard, formatScoreline } from '@/components/sports/scorecard';
import { WICKET_TYPES, type ExtraType, type WicketType } from '@/lib/cricket';
import type { PlayerItem } from '@/types/sports';
import type { ScorebookInnings, ScorebookResponse } from '@/types/cricket';

const RUNS = [0, 1, 2, 3, 4, 6];

export function ScorePad({
  innings,
  squad,
  opposition,
  onUpdate,
}: {
  innings: ScorebookInnings;
  squad: PlayerItem[];
  opposition: string;
  onUpdate: (book: ScorebookResponse) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [wicketOpen, setWicketOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBowler, setNewBowler] = useState('');

  const striker = innings.batters.find((b) => b.id === innings.strikerId);
  const nonStriker = innings.batters.find((b) => b.id === innings.nonStrikerId);
  const bowler = innings.bowlers.find((b) => b.id === innings.currentBowlerId);
  const battingNames = useMemo(
    () => new Set(innings.batters.map((b) => b.name.toLowerCase())),
    [innings.batters]
  );
  const unusedSquad = squad.filter(
    (p) => !battingNames.has(`${p.firstName} ${p.lastName}`.toLowerCase())
  );

  async function post(url: string, body?: unknown, method = 'POST') {
    setBusy(true);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = (await res.json()) as ScorebookResponse & { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? 'Could not update scorebook');
        return;
      }
      onUpdate(data);
    } finally {
      setBusy(false);
    }
  }

  function sendBall(payload: {
    runsOffBat?: number;
    extraType?: ExtraType;
    extraRuns?: number;
    wicketType?: WicketType;
    dismissedId?: string;
    newBatter?: { name: string };
    nextBowlerId?: string;
    fielderName?: string;
  }) {
    return post(`/api/coach/scorebook/${innings.id}/ball`, {
      runsOffBat: payload.runsOffBat ?? 0,
      extraType: payload.extraType ?? null,
      extraRuns: payload.extraRuns,
      wicketType: payload.wicketType ?? null,
      dismissedId: payload.dismissedId ?? null,
      newBatter: payload.newBatter,
      nextBowlerId: payload.nextBowlerId,
      fielderName: payload.fielderName,
    });
  }

  async function addBowler() {
    const name = newBowler.trim();
    if (!name) return;
    await post(`/api/coach/scorebook/${innings.id}/player`, {
      name,
      role: 'BOWLER',
    });
    setNewBowler('');
  }

  if (innings.closed) {
    return <Scorecard innings={innings} />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-3xl font-semibold tabular-nums">
          {formatScoreline(innings)}
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">{striker?.name ?? 'Striker'} *</span>
          {' · '}
          {nonStriker?.name ?? 'Non-striker'}
        </p>
        <p className="text-sm text-muted-foreground">
          Bowling: {bowler?.name ?? 'Select bowler'}
        </p>
      </div>

      {innings.overComplete ? (
        <div className="space-y-2 rounded-xl border border-primary/40 bg-card p-4">
          <p className="text-sm font-medium">Over complete — change bowler</p>
          <select
            className="min-h-11 w-full rounded-md border border-input bg-background px-3"
            defaultValue=""
            onChange={(event) => {
              if (event.target.value) {
                void post(`/api/coach/scorebook/${innings.id}/strike`, {
                  bowlerId: event.target.value,
                });
              }
            }}
          >
            <option value="">Choose bowler</option>
            {innings.bowlers
              .filter((item) => item.id !== innings.currentBowlerId)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <div className="flex gap-2">
            <input
              className="min-h-11 flex-1 rounded-md border border-input bg-background px-3"
              placeholder={`New ${opposition} / HVPS bowler`}
              value={newBowler}
              onChange={(event) => setNewBowler(event.target.value)}
            />
            <Button type="button" variant="outline" onClick={() => void addBowler()}>
              Add
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {RUNS.map((run) => (
              <Button
                key={run}
                type="button"
                variant={run === 4 || run === 6 ? 'default' : 'secondary'}
                disabled={busy}
                onClick={() => void sendBall({ runsOffBat: run })}
              >
                {run}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => void sendBall({ extraType: 'WIDE', extraRuns: 1 })}
            >
              Wd
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() =>
                void sendBall({ extraType: 'NO_BALL', extraRuns: 1 })
              }
            >
              Nb
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => void sendBall({ extraType: 'BYE', extraRuns: 1 })}
            >
              B
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() =>
                void sendBall({ extraType: 'LEG_BYE', extraRuns: 1 })
              }
            >
              Lb
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={busy}
              onClick={() => setWicketOpen(true)}
            >
              Wicket
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() =>
                void post(`/api/coach/scorebook/${innings.id}/ball`, undefined, 'DELETE')
              }
            >
              Undo
            </Button>
          </div>
        </>
      )}

      {wicketOpen ? (
        <WicketForm
          innings={innings}
          unusedSquad={unusedSquad}
          newName={newName}
          setNewName={setNewName}
          busy={busy}
          onCancel={() => setWicketOpen(false)}
          onSubmit={(payload) => {
            setWicketOpen(false);
            void sendBall(payload);
          }}
        />
      ) : null}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={busy}
        onClick={() => void post(`/api/coach/scorebook/${innings.id}/close`)}
      >
        Close innings
      </Button>

      <Scorecard innings={innings} />
    </div>
  );
}

function WicketForm({
  innings,
  unusedSquad,
  newName,
  setNewName,
  busy,
  onCancel,
  onSubmit,
}: {
  innings: ScorebookInnings;
  unusedSquad: PlayerItem[];
  newName: string;
  setNewName: (value: string) => void;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (payload: {
    wicketType: WicketType;
    dismissedId: string;
    newBatter?: { name: string };
    fielderName?: string;
  }) => void;
}) {
  const [wicketType, setWicketType] = useState<WicketType>('BOWLED');
  const [dismissedId, setDismissedId] = useState(innings.strikerId ?? '');
  const [nextBatter, setNextBatter] = useState('');
  const [fielderName, setFielderName] = useState('');

  return (
    <form
      className="space-y-3 rounded-xl border border-border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const name = nextBatter || newName.trim();
        onSubmit({
          wicketType,
          dismissedId,
          newBatter: name ? { name } : undefined,
          fielderName: fielderName || undefined,
        });
        setNewName('');
      }}
    >
      <p className="font-medium">Wicket</p>
      <label className="block text-sm">
        How out
        <select
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={wicketType}
          onChange={(event) => setWicketType(event.target.value as WicketType)}
        >
          {WICKET_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Batter out
        <select
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={dismissedId}
          onChange={(event) => setDismissedId(event.target.value)}
        >
          {innings.batters
            .filter((b) => b.howOut === 'NOT_OUT')
            .map((batter) => (
              <option key={batter.id} value={batter.id}>
                {batter.name}
              </option>
            ))}
        </select>
      </label>
      {(wicketType === 'CAUGHT' || wicketType === 'STUMPED' || wicketType === 'RUN_OUT') && (
        <input
          className="min-h-11 w-full rounded-md border border-input bg-background px-3"
          placeholder="Fielder"
          value={fielderName}
          onChange={(event) => setFielderName(event.target.value)}
        />
      )}
      {innings.totals.wickets < 9 ? (
        <>
          <label className="block text-sm">
            Next batter
            <select
              className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
              value={nextBatter}
              onChange={(event) => setNextBatter(event.target.value)}
            >
              <option value="">Type a name below</option>
              {unusedSquad.map((player) => (
                <option
                  key={player.id}
                  value={`${player.firstName} ${player.lastName}`}
                >
                  {player.firstName} {player.lastName}
                </option>
              ))}
            </select>
          </label>
          <input
            className="min-h-11 w-full rounded-md border border-input bg-background px-3"
            placeholder="Or type next batter"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          Record wicket
        </Button>
      </div>
    </form>
  );
}
