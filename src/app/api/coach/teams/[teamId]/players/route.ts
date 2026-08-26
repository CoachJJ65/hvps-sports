import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { serializePlayer } from '@/lib/sports';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;

  const { teamId } = await params;
  try {
    const players = await db.player.findMany({
      where: { team_id: teamId },
      orderBy: { last_name: 'asc' },
    });
    return NextResponse.json(players.map(serializePlayer));
  } catch {
    return jsonError('Failed to fetch team players', 500);
  }
}
