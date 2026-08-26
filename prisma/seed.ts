import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function upsertUser(data: {
  email: string;
  name: string;
  role: Role;
  password: string;
  pin?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role,
      password_hash: await bcrypt.hash(data.password, 12),
      pin_hash: data.pin ? await bcrypt.hash(data.pin, 12) : null,
    },
  });
}

async function getOrCreateSport(name: string) {
  return prisma.sport.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function getOrCreateTeam(name: string, sport_id: string) {
  const existing = await prisma.team.findUnique({
    where: { sport_id_name: { sport_id, name } },
  });
  if (existing) return existing;
  return prisma.team.create({ data: { name, sport_id } });
}

async function main() {
  const admin = await upsertUser({
    email: 'admin@hvps.local',
    name: 'HVPS Admin',
    role: Role.ADMIN,
    password: 'changeme-admin',
    pin: '1234',
  });

  const hod = await upsertUser({
    email: 'hod@hvps.local',
    name: 'Mr David Miller (HOD Sports)',
    role: Role.HOD_SPORTS,
    password: 'Hod12345!',
    pin: '2345',
  });

  const head = await upsertUser({
    email: 'headofsports@hvps.local',
    name: 'Mrs Sarah Jenkins (Head of Sports)',
    role: Role.HEAD_OF_SPORTS,
    password: 'Head12345!',
    pin: '3456',
  });

  const coachNames = [
    { name: 'Coach Thomas', email: 'thomas@hvps.local', pin: '1111' },
    { name: 'Coach Chris', email: 'chris@hvps.local', pin: '2222' },
    { name: 'Coach Botjie', email: 'botjie@hvps.local', pin: '3333' },
    { name: 'Coach Connor', email: 'connor@hvps.local', pin: '4444' },
    { name: 'Coach Busani', email: 'busani@hvps.local', pin: '5555' },
    { name: 'Coach Storm', email: 'storm@hvps.local', pin: '6666' },
    { name: 'Coach Jordan', email: 'jordan@hvps.local', pin: '7777' },
    { name: 'Coach Keagan', email: 'keagan@hvps.local', pin: '8888' },
  ];

  for (const coach of coachNames) {
    await upsertUser({
      email: coach.email,
      name: coach.name,
      role: Role.COACH,
      password: 'Coach12345!',
      pin: coach.pin,
    });
  }

  const parent = await upsertUser({
    email: 'parent@hvps.local',
    name: 'Mrs Lerato Khumalo',
    role: Role.PARENT,
    password: 'Parent12345!',
    pin: '5678',
  });

  const rugby = await getOrCreateSport('Rugby');
  const cricket = await getOrCreateSport('Cricket');
  const football = await getOrCreateSport('Football');
  const athletics = await getOrCreateSport('Athletics');
  const leftoverNetball = await prisma.sport.findUnique({
    where: { name: 'Netball' },
  });
  if (leftoverNetball) {
    await prisma.sport.delete({ where: { id: leftoverNetball.id } });
  }

  const rugbyTeamNames = [
    'First Team',
    'Second Team',
    'U13A',
    'U13B',
    'U11A',
    'U11B',
    'Under 9',
    'Under 8 Blue',
    'Under 8 Green',
    'Under 7 Blue',
    'Under 7 Yellow',
    'Girls Touch 1',
    'Girls Touch 2',
    'Girls Touch 3',
    'Girls Touch 4',
  ];
  const ageGroupTeams = ['First Team', 'U13A', 'U13B', 'U11A', 'U11B', 'U9'];
  const athleticsTeams = ['U13', 'U11', 'U9', 'U7'];

  const teams: Record<string, { id: string }> = {};
  for (const name of rugbyTeamNames) {
    teams[name] = await getOrCreateTeam(name, rugby.id);
  }
  for (const name of ageGroupTeams) {
    teams[`cricket:${name}`] = await getOrCreateTeam(name, cricket.id);
    teams[`football:${name}`] = await getOrCreateTeam(name, football.id);
  }
  for (const name of athleticsTeams) {
    teams[`athletics:${name}`] = await getOrCreateTeam(name, athletics.id);
  }

  async function ensurePlayers(
    teamId: string,
    rows: { first_name: string; last_name: string; house_name?: string; parent_id?: string }[]
  ) {
    const count = await prisma.player.count({ where: { team_id: teamId } });
    if (count > 0) return;
    await prisma.player.createMany({
      data: rows.map((row) => ({ ...row, team_id: teamId })),
    });
  }

  await ensurePlayers(teams['U13A'].id, [
    { first_name: 'Sipho', last_name: 'Khumalo', house_name: 'Blue', parent_id: parent.id },
    { first_name: 'Pieter', last_name: 'du Toit', house_name: 'Red' },
    { first_name: 'Kobus', last_name: 'van der Merwe', house_name: 'Yellow' },
    { first_name: 'Lunga', last_name: 'Ncube', house_name: 'Blue' },
    { first_name: 'Devon', last_name: 'Smith', house_name: 'Red' },
    { first_name: 'Thabo', last_name: 'Mokoena', house_name: 'Yellow' },
    { first_name: 'Dawie', last_name: 'Cronje', house_name: 'Blue' },
    { first_name: 'Jaden', last_name: 'Hendricks', house_name: 'Red' },
    { first_name: 'Reece', last_name: 'Williams', house_name: 'Yellow' },
    { first_name: 'Andile', last_name: 'Dlamini', house_name: 'Blue' },
    { first_name: 'Zian', last_name: 'Coetzee', house_name: 'Red' },
    { first_name: 'Keagan', last_name: 'Meyer', house_name: 'Yellow' },
    { first_name: 'Mandla', last_name: 'Zulu', house_name: 'Blue' },
    { first_name: 'Connor', last_name: 'Pretorius', house_name: 'Red' },
    { first_name: 'Francois', last_name: 'Botha', house_name: 'Yellow' },
  ]);
  await ensurePlayers(teams['U13B'].id, [
    { first_name: 'Liam', last_name: "O'Connor", house_name: 'Blue' },
    { first_name: 'Bongani', last_name: 'Sithole', house_name: 'Red' },
    { first_name: 'Ruan', last_name: 'Nel', house_name: 'Yellow' },
  ]);
  await ensurePlayers(teams['Girls Touch 1'].id, [
    { first_name: 'Naledi', last_name: 'Maseko', house_name: 'Blue' },
    { first_name: 'Aisha', last_name: 'Naidoo', house_name: 'Red' },
  ]);
  await ensurePlayers(teams['cricket:U13A'].id, [
    { first_name: 'Sipho', last_name: 'Khumalo', house_name: 'Blue', parent_id: parent.id },
    { first_name: 'Pieter', last_name: 'du Toit', house_name: 'Red' },
    { first_name: 'Lunga', last_name: 'Ncube', house_name: 'Blue' },
    { first_name: 'Devon', last_name: 'Smith', house_name: 'Red' },
    { first_name: 'Thabo', last_name: 'Mokoena', house_name: 'Yellow' },
    { first_name: 'Jaden', last_name: 'Hendricks', house_name: 'Red' },
    { first_name: 'Reece', last_name: 'Williams', house_name: 'Yellow' },
    { first_name: 'Andile', last_name: 'Dlamini', house_name: 'Blue' },
    { first_name: 'Zian', last_name: 'Coetzee', house_name: 'Red' },
    { first_name: 'Keagan', last_name: 'Meyer', house_name: 'Yellow' },
    { first_name: 'Mandla', last_name: 'Zulu', house_name: 'Blue' },
  ]);
  await ensurePlayers(teams['football:U13A'].id, [
    { first_name: 'Dawie', last_name: 'Cronje', house_name: 'Blue' },
    { first_name: 'Connor', last_name: 'Pretorius', house_name: 'Red' },
    { first_name: 'Francois', last_name: 'Botha', house_name: 'Yellow' },
  ]);
  await ensurePlayers(teams['athletics:U13'].id, [
    { first_name: 'Lerato', last_name: 'Phiri', house_name: 'Blue' },
    { first_name: 'Chantel', last_name: 'De Beer', house_name: 'Red' },
    { first_name: 'Amahle', last_name: 'Zondo', house_name: 'Yellow' },
  ]);

  const fixtureCount = await prisma.fixture.count();
  if (fixtureCount === 0) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(15, 0, 0, 0);

    const thisSaturday = new Date(today);
    const day = today.getDay();
    const daysUntilSat = (6 - day + 7) % 7 || 7;
    thisSaturday.setDate(today.getDate() + daysUntilSat);
    thisSaturday.setHours(9, 0, 0, 0);

    const awayTime = new Date(thisSaturday);
    awayTime.setHours(10, 30, 0, 0);
    const busTime = new Date(awayTime);
    busTime.setMinutes(awayTime.getMinutes() - 75);

    const girlsTime = new Date(thisSaturday);
    girlsTime.setHours(8, 0, 0, 0);

    await prisma.fixture.create({
      data: {
        team_id: teams['U13A'].id,
        opponent: 'Ridge Prep',
        date_time: yesterday,
        location: 'Ridge Field A',
        is_away: true,
        status: 'COMPLETED',
        home_score: 12,
        away_score: 24,
        notes:
          'Excellent performance by the forwards. Solid scrummaging led to three tries in the second half.',
      },
    });

    const upcomingHome = await prisma.fixture.create({
      data: {
        team_id: teams['U13A'].id,
        opponent: 'St Stithians Primary',
        date_time: thisSaturday,
        location: 'HVPS Field A',
        is_away: false,
        status: 'SCHEDULED',
      },
    });

    await prisma.fixture.create({
      data: {
        team_id: teams['U13B'].id,
        opponent: 'Trinityhouse Prep',
        date_time: awayTime,
        location: 'Trinityhouse Field B',
        is_away: true,
        bus_time: busTime,
        status: 'SCHEDULED',
      },
    });

    await prisma.fixture.create({
      data: {
        team_id: teams['First Team'].id,
        opponent: 'Bedfordview Primary',
        date_time: thisSaturday,
        location: 'Field A — Bedfordview',
        is_away: true,
        status: 'SCHEDULED',
      },
    });

    await prisma.fixture.create({
      data: {
        team_id: teams['Girls Touch 1'].id,
        opponent: 'Reddam 1',
        date_time: girlsTime,
        location: 'HVPS Field C',
        is_away: false,
        status: 'SCHEDULED',
      },
    });

    const u13aPlayers = await prisma.player.findMany({
      where: { team_id: teams['U13A'].id },
    });
    const rugbyPositions = [
      'Loosehead Prop',
      'Hooker',
      'Tighthead Prop',
      'Lock',
      'Lock',
      'Blindside Flanker',
      'Openside Flanker',
      'Number 8',
      'Scrumhalf',
      'Flyhalf',
      'Left Wing',
      'Inside Centre',
      'Outside Centre',
      'Right Wing',
      'Fullback',
    ];
    if (u13aPlayers.length > 0) {
      await prisma.selection.createMany({
        data: u13aPlayers.map((player, index) => ({
          fixture_id: upcomingHome.id,
          player_id: player.id,
          position: rugbyPositions[index] ?? 'Reserve',
        })),
      });
    }
  }

  async function ensureFixture(teamId: string, opponent: string, data: {
    date_time: Date;
    location: string;
    is_away?: boolean;
    bus_time?: Date;
    status?: string;
  }) {
    const existing = await prisma.fixture.findFirst({
      where: { team_id: teamId, opponent },
    });
    if (existing) return existing;
    return prisma.fixture.create({
      data: {
        team_id: teamId,
        opponent,
        date_time: data.date_time,
        location: data.location,
        is_away: data.is_away ?? false,
        bus_time: data.bus_time,
        status: data.status ?? 'SCHEDULED',
      },
    });
  }

  {
    const saturday = new Date();
    const daysUntilSat = (6 - saturday.getDay() + 7) % 7 || 7;
    saturday.setDate(saturday.getDate() + daysUntilSat);
    saturday.setHours(9, 30, 0, 0);
    const footballTime = new Date(saturday);
    footballTime.setHours(11, 0, 0, 0);
    const athleticsTime = new Date(saturday);
    athleticsTime.setHours(8, 0, 0, 0);

    await ensureFixture(teams['cricket:U13A'].id, "St John's College Prep", {
      date_time: saturday,
      location: 'HVPS cricket oval',
    });
    await ensureFixture(teams['cricket:U11A'].id, 'St Stithians Primary', {
      date_time: saturday,
      location: 'St Stithians oval',
      is_away: true,
    });
    await ensureFixture(teams['football:U13A'].id, 'Bedfordview Primary', {
      date_time: footballTime,
      location: 'HVPS Field B',
    });
    await ensureFixture(teams['athletics:U13'].id, 'District athletics', {
      date_time: athleticsTime,
      location: 'Germiston Stadium',
      is_away: true,
    });
  }

  if ((await prisma.notice.count()) === 0) {
    await prisma.notice.createMany({
      data: [
        {
          title: 'LIGHTNING RISK WARNING',
          content:
            'High thunderstorm activity predicted this afternoon. If the lightning siren sounds, all players must leave the field immediately and head to the change rooms. Parents, please collect learners promptly after practice.',
          type: 'LIGHTNING',
        },
        {
          title: 'Weekend rugby derby vs St Stithians',
          content:
            'We are hosting St Stithians this Saturday. Clean jerseys are required. The tuck shop will be open, serving hot drinks and snacks. Come support the boys and the Girls Touch festival.',
          type: 'GENERAL',
        },
        {
          title: 'U13B Trinityhouse travel details',
          content:
            'The bus for the U13B away match will depart the HVPS parking lot at 09:15. Please ensure players arrive by 09:00 in full match kit.',
          type: 'GENERAL',
        },
      ],
    });
  }

  if ((await prisma.formDocument.count()) === 0) {
    await prisma.formDocument.create({
      data: {
        title: 'HVPS U13 Rugby Tournament & Girls Touch Schedule',
        type: 'TOURNAMENT_SCHEDULE',
        sport_id: rugby.id,
        author_id: hod.id,
        is_published: true,
        content_json: JSON.stringify({
          eventTitle: 'HVPS U13 Rugby Tournament + Girls Touch Rugby',
          date: 'Saturday 01 August 2026',
          timeRange: '08:00 - 13:30',
          generalRules: [
            '15 players per team (max squad 23)',
            'NO U14 PLAYERS ALLOWED',
            '15 minutes one-way games',
            '3 points per win, 1 point per draw',
            'Golden point for knockout ties',
            'Girls Touch: 6 players per team, max squad 12, friendly festival format',
          ],
          fixtures: [
            { pool: 'A', time: '08:30 - 08:45', team1: 'Alberview', team2: 'Reddam', field: 'Field A' },
            { pool: 'B', time: '08:47 - 09:02', team1: 'Wendywood', team2: 'Montrose', field: 'Field B' },
            { pool: 'A', time: '09:04 - 09:19', team1: 'HVPS A', team2: 'Bedfordview', field: 'Field A' },
            { pool: 'B', time: '09:21 - 09:36', team1: 'Edenglen', team2: 'HVPS B', field: 'Field B' },
          ],
        }),
      },
    });

    await prisma.formDocument.create({
      data: {
        title: 'Coaches Planner (Week 1) 7 & 8 August',
        type: 'COACHES_PLANNER',
        sport_id: rugby.id,
        author_id: head.id,
        is_published: true,
        content_json: JSON.stringify({
          title: 'Coaches match-day & warm-up duty matrix',
          location: 'Bedfordview Primary School',
          duties: [
            { day: 'Friday 07 Aug', team: 'Under 8 Blue', time: '14:30 - 14:55', opposition: 'Reddam 1', coach: 'Coach Thomas', warmUpCoach: 'Coach Thomas', referee: 'Coach Busani' },
            { day: 'Friday 07 Aug', team: 'Under 7 Blue', time: '15:00 - 15:25', opposition: 'Reddam 1', coach: 'Coach Chris', warmUpCoach: 'Coach Chris', referee: 'Coach Thomas' },
            { day: 'Friday 07 Aug', team: 'U11A', time: '15:10 - 15:45', opposition: 'Reddam', coach: 'Coach Botjie', warmUpCoach: 'Coach Botjie', referee: 'Official' },
            { day: 'Saturday 08 Aug', team: 'Under 9', time: '08:00 - 08:35', opposition: 'Reddam', coach: 'Coach Storm & Busani', warmUpCoach: 'Coach Storm & Busani', referee: 'Coach Jordan' },
            { day: 'Saturday 08 Aug', team: 'Girls Touch 2', time: '08:00 - 08:35', opposition: 'Reddam 1', coach: 'Coach Keagan & Thomas', warmUpCoach: 'Coach Keagan & Thomas', referee: 'Coach Thomas' },
            { day: 'Saturday 08 Aug', team: 'First Team', time: '09:40 - 10:25', opposition: 'Reddam', coach: 'Coach Jordan & Keagan', warmUpCoach: 'Coach Jordan & Keagan', referee: 'Official' },
          ],
        }),
      },
    });

    await prisma.formDocument.create({
      data: {
        title: 'Under 7 & Under 8 Tag Rugby Official Rules 2026',
        type: 'RUGBY_RULES',
        sport_id: rugby.id,
        author_id: admin.id,
        is_published: true,
        content_json: JSON.stringify({
          title: 'English Primary School Development Rugby League 2026',
          u7Rules: [
            '7 players on field (rolling subs)',
            '2x tags and 1x rugby belt (or bibs tucked in)',
            'Shirts must be tucked in at all times',
            'Game commences with tap and pass (no kicking)',
            '3 tag turnovers',
            'No contact allowed (hand-offs and blocking tags forbidden)',
            'Offside line is 3m',
            'Game duration: 10 minutes per half, 5-minute half-time',
          ],
          u8Rules: [
            '7 players on field (3 forwards, 4 backline)',
            'Game commences with a kick (drop, punt, or place)',
            'Uncontested scrums and lineouts (no lifting)',
            'Offside line is 5m',
            'Tag: ball carrier must lie down and place the ball towards their team; defender lies next to the carrier until the ball is played',
            'Game duration: 10 minutes per half, 5-minute half-time',
          ],
        }),
      },
    });
  }

  console.log('HVPS Sports seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
