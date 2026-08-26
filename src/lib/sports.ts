import type {
  Fixture,
  FormDocument,
  Notice,
  Player,
  Selection,
  Sport,
  Team,
  User,
} from '@prisma/client';

type TeamWithSport = Team & { sport: Sport; players?: Player[] };
type FixtureWithTeam = Fixture & { team: TeamWithSport };
type SelectionWithPlayer = Selection & { player: Player };
type FormWithMeta = FormDocument & {
  sport?: Sport | null;
  author?: Pick<User, 'id' | 'name' | 'role'> | null;
};

export function serializePlayer(player: Player) {
  return {
    id: player.id,
    firstName: player.first_name,
    lastName: player.last_name,
    houseName: player.house_name,
    teamId: player.team_id,
    parentId: player.parent_id,
  };
}

export function serializeTeam(team: TeamWithSport) {
  return {
    id: team.id,
    name: team.name,
    sportId: team.sport_id,
    sport: { id: team.sport.id, name: team.sport.name },
    players: team.players?.map(serializePlayer) ?? [],
  };
}

export function serializeFixture(fixture: FixtureWithTeam) {
  return {
    id: fixture.id,
    teamId: fixture.team_id,
    opponent: fixture.opponent,
    dateTime: fixture.date_time.toISOString(),
    location: fixture.location,
    isAway: fixture.is_away,
    busTime: fixture.bus_time ? fixture.bus_time.toISOString() : null,
    status: fixture.status,
    homeScore: fixture.home_score,
    awayScore: fixture.away_score,
    notes: fixture.notes,
    team: serializeTeam(fixture.team),
  };
}

export function serializeSelection(selection: SelectionWithPlayer) {
  return {
    id: selection.id,
    fixtureId: selection.fixture_id,
    playerId: selection.player_id,
    position: selection.position,
    player: serializePlayer(selection.player),
  };
}

export function serializeNotice(notice: Notice) {
  return {
    id: notice.id,
    title: notice.title,
    content: notice.content,
    type: notice.type,
    createdAt: notice.created_at.toISOString(),
    updatedAt: notice.updated_at.toISOString(),
  };
}

export function serializeForm(form: FormWithMeta) {
  return {
    id: form.id,
    title: form.title,
    type: form.type,
    sportId: form.sport_id,
    authorId: form.author_id,
    contentJson: form.content_json,
    isPublished: form.is_published,
    createdAt: form.created_at.toISOString(),
    updatedAt: form.updated_at.toISOString(),
    sport: form.sport ? { id: form.sport.id, name: form.sport.name } : null,
    author: form.author
      ? { id: form.author.id, name: form.author.name, role: form.author.role }
      : undefined,
  };
}

export const fixtureInclude = {
  team: {
    include: {
      sport: true,
    },
  },
} as const;

export const teamInclude = {
  sport: true,
  players: true,
} as const;

export const formInclude = {
  sport: true,
  author: {
    select: { id: true, name: true, role: true },
  },
} as const;
