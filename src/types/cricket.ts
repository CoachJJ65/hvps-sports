import type { CricketScoreline, FixtureItem } from '@/types/sports';

export interface ScorebookBatter {
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

export interface ScorebookBowler {
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

export interface ScorebookInnings {
  id: string;
  battingSide: 'HVPS' | 'OPPOSITION';
  inningsNumber: number;
  oversLimit: number;
  closed: boolean;
  strikerId: string | null;
  nonStrikerId: string | null;
  currentBowlerId: string | null;
  totals: {
    runs: number;
    wickets: number;
    legalBalls: number;
    overs: string;
    extras: {
      wides: number;
      noBalls: number;
      byes: number;
      legByes: number;
    };
  };
  batters: ScorebookBatter[];
  bowlers: ScorebookBowler[];
  fall: { wicket: number; score: number; batter: string; overs: string }[];
  lastDeliveries: {
    sequence: number;
    over_number: number;
    ball_in_over: number;
    runs_off_bat: number;
    extra_type: string | null;
    extra_runs: number;
    is_legal: boolean;
    wicket_type: string | null;
  }[];
  overComplete: boolean;
}

export interface ScorebookResponse {
  fixture: FixtureItem;
  innings: ScorebookInnings[];
}

export type { CricketScoreline };
