export type NoticeType = 'GENERAL' | 'WEATHER' | 'LIGHTNING' | string;

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  type: NoticeType;
  createdAt: string;
}

export interface SportRef {
  id: string;
  name: string;
}

export interface PlayerItem {
  id: string;
  firstName: string;
  lastName: string;
  houseName: string | null;
  teamId: string | null;
  parentId?: string | null;
}

export interface TeamItem {
  id: string;
  name: string;
  sportId: string;
  sport: SportRef;
  players: PlayerItem[];
}

export interface CricketScoreline {
  runs: number;
  wickets: number;
  overs: string;
}

export interface FixtureItem {
  id: string;
  teamId: string;
  opponent: string;
  dateTime: string;
  location: string;
  isAway: boolean;
  busTime: string | null;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | string;
  homeScore: number | null;
  awayScore: number | null;
  notes: string | null;
  team: TeamItem;
  cricket?: {
    hvps: CricketScoreline | null;
    opposition: CricketScoreline | null;
  } | null;
}

export interface SelectionItem {
  id: string;
  fixtureId: string;
  playerId: string;
  position: string | null;
  player: PlayerItem;
}

export interface FormItem {
  id: string;
  title: string;
  type: string;
  sportId: string | null;
  contentJson: string;
  isPublished: boolean;
  createdAt: string;
  sport?: SportRef | null;
  author?: { id?: string; name: string; role: string };
}

export type AttendanceMark = 'PRESENT' | 'ABSENT' | 'EXCUSED';
