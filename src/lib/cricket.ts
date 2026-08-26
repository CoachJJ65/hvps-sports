export const EXTRA_TYPES = ['WIDE', 'NO_BALL', 'BYE', 'LEG_BYE'] as const;
export const WICKET_TYPES = [
  'BOWLED',
  'CAUGHT',
  'LBW',
  'RUN_OUT',
  'STUMPED',
  'HIT_WICKET',
  'RETIRED',
] as const;

export type ExtraType = (typeof EXTRA_TYPES)[number];
export type WicketType = (typeof WICKET_TYPES)[number];
export type BattingSide = 'HVPS' | 'OPPOSITION';

export interface DeliveryInput {
  runsOffBat: number;
  extraType?: ExtraType | null;
  extraRuns?: number;
  wicketType?: WicketType | null;
  dismissedId?: string | null;
}

export interface StoredDelivery {
  sequence: number;
  over_number: number;
  ball_in_over: number;
  bowler_id: string;
  striker_id: string;
  non_striker_id: string;
  runs_off_bat: number;
  extra_type: string | null;
  extra_runs: number;
  is_legal: boolean;
  wicket_type: string | null;
  dismissed_id: string | null;
}

export function isLegalExtra(extraType: string | null | undefined) {
  return extraType !== 'WIDE' && extraType !== 'NO_BALL';
}

export function isBowlerWicket(type: string | null | undefined) {
  return (
    type === 'BOWLED' ||
    type === 'CAUGHT' ||
    type === 'LBW' ||
    type === 'STUMPED' ||
    type === 'HIT_WICKET'
  );
}

export function formatOvers(legalBalls: number) {
  return `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
}

export function extraRunsFor(input: DeliveryInput) {
  if (input.extraType === 'WIDE' || input.extraType === 'NO_BALL') {
    return Math.max(1, input.extraRuns ?? 1);
  }
  if (input.extraType === 'BYE' || input.extraType === 'LEG_BYE') {
    return Math.max(1, input.extraRuns ?? 1);
  }
  return input.extraRuns ?? 0;
}

export function rotateOnDelivery(input: DeliveryInput) {
  if (input.extraType === 'WIDE') return extraRunsFor(input) % 2 === 1 && extraRunsFor(input) > 1;
  if (input.extraType === 'BYE' || input.extraType === 'LEG_BYE') {
    return extraRunsFor(input) % 2 === 1;
  }
  return input.runsOffBat % 2 === 1;
}

export function nextEnds(args: {
  strikerId: string;
  nonStrikerId: string;
  legalBallsAfter: number;
  input: DeliveryInput;
}) {
  let strikerId = args.strikerId;
  let nonStrikerId = args.nonStrikerId;
  if (rotateOnDelivery(args.input)) {
    [strikerId, nonStrikerId] = [nonStrikerId, strikerId];
  }
  if (args.legalBallsAfter > 0 && args.legalBallsAfter % 6 === 0) {
    [strikerId, nonStrikerId] = [nonStrikerId, strikerId];
  }
  return { strikerId, nonStrikerId };
}

export function batterFacedBall(extraType: string | null | undefined) {
  return extraType !== 'WIDE';
}

export function computeBatterLine(
  batterId: string,
  deliveries: StoredDelivery[]
) {
  const faced = deliveries.filter(
    (d) => d.striker_id === batterId && batterFacedBall(d.extra_type)
  );
  const runs = faced.reduce((sum, d) => sum + d.runs_off_bat, 0);
  const balls = faced.length;
  const fours = faced.filter((d) => d.runs_off_bat === 4).length;
  const sixes = faced.filter((d) => d.runs_off_bat === 6).length;
  return { runs, balls, fours, sixes };
}

export function computeBowlerLine(
  bowlerId: string,
  deliveries: StoredDelivery[]
) {
  const theirs = deliveries.filter((d) => d.bowler_id === bowlerId);
  const legalBalls = theirs.filter((d) => d.is_legal).length;
  const wides = theirs
    .filter((d) => d.extra_type === 'WIDE')
    .reduce((sum, d) => sum + d.extra_runs, 0);
  const noBalls = theirs.filter((d) => d.extra_type === 'NO_BALL').length;
  const runs = theirs.reduce((sum, d) => {
    if (d.extra_type === 'BYE' || d.extra_type === 'LEG_BYE') {
      return sum + d.runs_off_bat;
    }
    return sum + d.runs_off_bat + d.extra_runs;
  }, 0);
  const wickets = theirs.filter((d) => isBowlerWicket(d.wicket_type)).length;

  const byOver = new Map<number, number>();
  for (const d of theirs) {
    const conceded =
      d.extra_type === 'BYE' || d.extra_type === 'LEG_BYE'
        ? 0
        : d.runs_off_bat + d.extra_runs;
    byOver.set(d.over_number, (byOver.get(d.over_number) ?? 0) + conceded);
  }
  let maidens = 0;
  const completedOvers = new Set(
    theirs.filter((d) => d.is_legal && d.ball_in_over === 6).map((d) => d.over_number)
  );
  for (const over of completedOvers) {
    if ((byOver.get(over) ?? 0) === 0) maidens += 1;
  }

  return { legalBalls, overs: formatOvers(legalBalls), maidens, runs, wickets, wides, noBalls };
}

export function computeInningsTotals(deliveries: StoredDelivery[]) {
  const legalBalls = deliveries.filter((d) => d.is_legal).length;
  const runs = deliveries.reduce(
    (sum, d) => sum + d.runs_off_bat + d.extra_runs,
    0
  );
  const wickets = deliveries.filter((d) => d.wicket_type).length;
  const extras = {
    wides: deliveries
      .filter((d) => d.extra_type === 'WIDE')
      .reduce((sum, d) => sum + d.extra_runs, 0),
    noBalls: deliveries
      .filter((d) => d.extra_type === 'NO_BALL')
      .reduce((sum, d) => sum + d.extra_runs, 0),
    byes: deliveries
      .filter((d) => d.extra_type === 'BYE')
      .reduce((sum, d) => sum + d.extra_runs, 0),
    legByes: deliveries
      .filter((d) => d.extra_type === 'LEG_BYE')
      .reduce((sum, d) => sum + d.extra_runs, 0),
  };
  return { runs, wickets, legalBalls, overs: formatOvers(legalBalls), extras };
}

export function fallOfWicket(
  deliveries: StoredDelivery[],
  names: Record<string, string>
) {
  const out: { wicket: number; score: number; batter: string; overs: string }[] =
    [];
  let runs = 0;
  let wickets = 0;
  let legal = 0;
  for (const d of deliveries) {
    runs += d.runs_off_bat + d.extra_runs;
    if (d.is_legal) legal += 1;
    if (d.wicket_type && d.dismissed_id) {
      wickets += 1;
      out.push({
        wicket: wickets,
        score: runs,
        batter: names[d.dismissed_id] ?? 'Batter',
        overs: formatOvers(legal),
      });
    }
  }
  return out;
}

export function buildStoredDelivery(args: {
  sequence: number;
  legalBallsBefore: number;
  bowlerId: string;
  strikerId: string;
  nonStrikerId: string;
  input: DeliveryInput;
}): StoredDelivery {
  const extraType = args.input.extraType ?? null;
  const isLegal = isLegalExtra(extraType);
  const overNumber = Math.floor(args.legalBallsBefore / 6);
  const ballInOver = isLegal ? (args.legalBallsBefore % 6) + 1 : args.legalBallsBefore % 6;
  return {
    sequence: args.sequence,
    over_number: overNumber,
    ball_in_over: ballInOver,
    bowler_id: args.bowlerId,
    striker_id: args.strikerId,
    non_striker_id: args.nonStrikerId,
    runs_off_bat: args.input.runsOffBat,
    extra_type: extraType,
    extra_runs: extraRunsFor(args.input),
    is_legal: isLegal,
    wicket_type: args.input.wicketType ?? null,
    dismissed_id: args.input.dismissedId ?? null,
  };
}

export function inningsShouldClose(args: {
  legalBalls: number;
  wickets: number;
  oversLimit: number;
}) {
  return args.wickets >= 10 || args.legalBalls >= args.oversLimit * 6;
}

export function howOutLabel(howOut: string) {
  switch (howOut) {
    case 'BOWLED':
      return 'b';
    case 'CAUGHT':
      return 'c';
    case 'LBW':
      return 'lbw';
    case 'RUN_OUT':
      return 'run out';
    case 'STUMPED':
      return 'st';
    case 'HIT_WICKET':
      return 'hit wicket';
    case 'RETIRED':
      return 'retired';
    case 'DNB':
      return 'dnb';
    case 'NOT_OUT':
      return 'not out';
    default:
      return howOut.toLowerCase();
  }
}

export function isCricketSport(name?: string | null) {
  return name?.toLowerCase() === 'cricket';
}

export interface ScorebookBatterRow {
  id: string;
  playerId: string | null;
  name: string;
  battingOrder: number;
  howOut: string;
  howOutLabel: string;
  bowlerName: string | null;
  fielderName: string | null;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

export interface ScorebookBowlerRow {
  id: string;
  playerId: string | null;
  name: string;
  bowlingOrder: number;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  wides: number;
  noBalls: number;
}

export interface ScorebookInningsView {
  id: string;
  battingSide: BattingSide;
  inningsNumber: number;
  oversLimit: number;
  closed: boolean;
  strikerId: string | null;
  nonStrikerId: string | null;
  currentBowlerId: string | null;
  totals: ReturnType<typeof computeInningsTotals>;
  batters: ScorebookBatterRow[];
  bowlers: ScorebookBowlerRow[];
  fall: ReturnType<typeof fallOfWicket>;
  lastDeliveries: StoredDelivery[];
  overComplete: boolean;
}

export function serializeInnings(innings: {
  id: string;
  batting_side: string;
  innings_number: number;
  overs_limit: number;
  closed: boolean;
  striker_id: string | null;
  non_striker_id: string | null;
  current_bowler_id: string | null;
  batters: {
    id: string;
    player_id: string | null;
    name: string;
    batting_order: number;
    how_out: string;
    bowler_name: string | null;
    fielder_name: string | null;
  }[];
  bowlers: {
    id: string;
    player_id: string | null;
    name: string;
    bowling_order: number;
  }[];
  deliveries: StoredDelivery[];
}): ScorebookInningsView {
  const deliveries = [...innings.deliveries].sort(
    (a, b) => a.sequence - b.sequence
  );
  const totals = computeInningsTotals(deliveries);
  const names = Object.fromEntries(
    innings.batters.map((batter) => [batter.id, batter.name])
  );
  const lastBall = deliveries[deliveries.length - 1];
  const overComplete =
    !innings.closed &&
    Boolean(lastBall?.is_legal) &&
    lastBall?.ball_in_over === 6 &&
    innings.current_bowler_id === lastBall?.bowler_id;

  return {
    id: innings.id,
    battingSide: innings.batting_side as BattingSide,
    inningsNumber: innings.innings_number,
    oversLimit: innings.overs_limit,
    closed: innings.closed,
    strikerId: innings.striker_id,
    nonStrikerId: innings.non_striker_id,
    currentBowlerId: innings.current_bowler_id,
    totals,
    batters: innings.batters
      .slice()
      .sort((a, b) => a.batting_order - b.batting_order)
      .map((batter) => {
        const line = computeBatterLine(batter.id, deliveries);
        return {
          id: batter.id,
          playerId: batter.player_id,
          name: batter.name,
          battingOrder: batter.batting_order,
          howOut: batter.how_out,
          howOutLabel: howOutLabel(batter.how_out),
          bowlerName: batter.bowler_name,
          fielderName: batter.fielder_name,
          ...line,
        };
      }),
    bowlers: innings.bowlers
      .slice()
      .sort((a, b) => a.bowling_order - b.bowling_order)
      .map((bowler) => ({
        id: bowler.id,
        playerId: bowler.player_id,
        name: bowler.name,
        bowlingOrder: bowler.bowling_order,
        ...computeBowlerLine(bowler.id, deliveries),
      })),
    fall: fallOfWicket(deliveries, names),
    lastDeliveries: deliveries.slice(-12),
    overComplete,
  };
}

export function cricketSummaryFromInnings(
  inningsList: ScorebookInningsView[]
) {
  const hvps = inningsList.find((item) => item.battingSide === 'HVPS') ?? null;
  const opposition =
    inningsList.find((item) => item.battingSide === 'OPPOSITION') ?? null;
  return {
    hvps: hvps
      ? {
          runs: hvps.totals.runs,
          wickets: hvps.totals.wickets,
          overs: hvps.totals.overs,
        }
      : null,
    opposition: opposition
      ? {
          runs: opposition.totals.runs,
          wickets: opposition.totals.wickets,
          overs: opposition.totals.overs,
        }
      : null,
  };
}
