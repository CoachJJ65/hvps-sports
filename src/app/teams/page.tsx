'use client';

import { useMemo, useState } from 'react';
import { useCachedJson } from '@/lib/use-cached-json';
import { playerName } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TeamItem } from '@/types/sports';

export default function TeamsPage() {
  const { data: teams, loading } = useCachedJson<TeamItem>(
    'teams',
    '/api/public/teams'
  );
  const [sport, setSport] = useState('ALL');
  const [openId, setOpenId] = useState<string | null>(null);

  const sports = useMemo(
    () => Array.from(new Set(teams.map((team) => team.sport.name))).sort(),
    [teams]
  );
  const filtered = teams.filter(
    (team) => sport === 'ALL' || team.sport.name === sport
  );

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <h1 className="pt-4 text-2xl font-semibold">Teams</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Age-group squads including Girls Touch Rugby.
      </p>

      {sports.length > 1 ? (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {['ALL', ...sports].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSport(name)}
              className={cn(
                'min-h-11 shrink-0 rounded-full border px-4 text-sm',
                sport === name
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card'
              )}
            >
              {name === 'ALL' ? 'All sports' : name}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="mt-4 space-y-3">
        {loading && filtered.length === 0 ? (
          <li className="text-sm text-muted-foreground">Loading teams…</li>
        ) : (
          filtered.map((team) => {
            const open = openId === team.id;
            return (
              <li
                key={team.id}
                className="rounded-xl border border-border bg-card"
              >
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between px-4 py-3 text-left"
                  onClick={() => setOpenId(open ? null : team.id)}
                >
                  <span>
                    <span className="block font-medium">{team.name}</span>
                    <span className="block text-sm text-muted-foreground">
                      {team.sport.name} · {team.players.length} players
                    </span>
                  </span>
                </button>
                {open ? (
                  <ul className="border-t border-border px-4 py-2">
                    {team.players.length === 0 ? (
                      <li className="py-2 text-sm text-muted-foreground">
                        Squad not published yet.
                      </li>
                    ) : (
                      team.players.map((player) => (
                        <li
                          key={player.id}
                          className="flex items-center justify-between py-2 text-sm"
                        >
                          <span>{playerName(player)}</span>
                          {player.houseName ? (
                            <span className="text-muted-foreground">
                              {player.houseName}
                            </span>
                          ) : null}
                        </li>
                      ))
                    )}
                  </ul>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
    </main>
  );
}
