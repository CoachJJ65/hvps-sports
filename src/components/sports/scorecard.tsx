import { howOutLabel } from '@/lib/cricket';
import type { ScorebookInnings } from '@/types/cricket';

export function formatScoreline(innings: ScorebookInnings) {
  return `${innings.totals.runs}/${innings.totals.wickets} (${innings.totals.overs} ov)`;
}

export function Scorecard({ innings }: { innings: ScorebookInnings }) {
  const extrasTotal =
    innings.totals.extras.wides +
    innings.totals.extras.noBalls +
    innings.totals.extras.byes +
    innings.totals.extras.legByes;

  return (
    <section className="space-y-4">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {innings.battingSide === 'HVPS' ? 'HVPS batting' : 'Opposition batting'}
          {innings.closed ? ' · innings closed' : ''}
        </p>
        <h2 className="text-xl font-semibold tabular-nums">
          {formatScoreline(innings)}
        </h2>
      </header>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[22rem] text-left text-sm">
          <thead className="bg-secondary text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Batter</th>
              <th className="px-3 py-2">How out</th>
              <th className="px-3 py-2 text-right">R</th>
              <th className="px-3 py-2 text-right">B</th>
              <th className="px-3 py-2 text-right">4</th>
              <th className="px-3 py-2 text-right">6</th>
            </tr>
          </thead>
          <tbody>
            {innings.batters.map((batter) => (
              <tr key={batter.id} className="border-t border-border">
                <td className="px-3 py-2 font-medium">
                  {batter.name}
                  {batter.id === innings.strikerId ? ' *' : ''}
                  {batter.id === innings.nonStrikerId ? ' †' : ''}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {batter.howOut === 'NOT_OUT'
                    ? 'not out'
                    : [
                        howOutLabel(batter.howOut),
                        batter.fielderName,
                        batter.bowlerName ? `b ${batter.bowlerName}` : null,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{batter.runs}</td>
                <td className="px-3 py-2 text-right tabular-nums">{batter.balls}</td>
                <td className="px-3 py-2 text-right tabular-nums">{batter.fours}</td>
                <td className="px-3 py-2 text-right tabular-nums">{batter.sixes}</td>
              </tr>
            ))}
            <tr className="border-t border-border">
              <td className="px-3 py-2" colSpan={2}>
                Extras (wd {innings.totals.extras.wides}, nb{' '}
                {innings.totals.extras.noBalls}, b {innings.totals.extras.byes}, lb{' '}
                {innings.totals.extras.legByes})
              </td>
              <td className="px-3 py-2 text-right tabular-nums">{extrasTotal}</td>
              <td colSpan={3} />
            </tr>
            <tr className="border-t border-border font-semibold">
              <td className="px-3 py-2" colSpan={2}>
                Total
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {innings.totals.runs}
              </td>
              <td className="px-3 py-2 text-right text-muted-foreground" colSpan={3}>
                {innings.totals.wickets} wkts
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {innings.fall.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          FoW:{' '}
          {innings.fall
            .map((item) => `${item.wicket}-${item.score} (${item.batter}, ${item.overs} ov)`)
            .join('; ')}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[22rem] text-left text-sm">
          <thead className="bg-secondary text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Bowler</th>
              <th className="px-3 py-2 text-right">O</th>
              <th className="px-3 py-2 text-right">M</th>
              <th className="px-3 py-2 text-right">R</th>
              <th className="px-3 py-2 text-right">W</th>
            </tr>
          </thead>
          <tbody>
            {innings.bowlers.map((bowler) => (
              <tr key={bowler.id} className="border-t border-border">
                <td className="px-3 py-2 font-medium">
                  {bowler.name}
                  {bowler.id === innings.currentBowlerId ? ' *' : ''}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{bowler.overs}</td>
                <td className="px-3 py-2 text-right tabular-nums">{bowler.maidens}</td>
                <td className="px-3 py-2 text-right tabular-nums">{bowler.runs}</td>
                <td className="px-3 py-2 text-right tabular-nums">{bowler.wickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
