import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError } from '@/lib/roles';
import { serializeTeam, teamInclude } from '@/lib/sports';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teams = await db.team.findMany({
      include: teamInclude,
      orderBy: [{ sport: { name: 'asc' } }, { name: 'asc' }],
    });
    return NextResponse.json(teams.map(serializeTeam));
  } catch {
    return jsonError('Failed to fetch teams', 500);
  }
}
