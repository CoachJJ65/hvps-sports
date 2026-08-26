import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { fixtureUpdateSchema } from '@/lib/validations';
import { fixtureInclude, serializeFixture } from '@/lib/sports';

function toScore(value: number | string | null | undefined) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const parsed = typeof value === 'number' ? value : parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = fixtureUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Invalid fixture update');
  }

  const data: Prisma.FixtureUpdateInput = {};
  const home = toScore(parsed.data.homeScore);
  const away = toScore(parsed.data.awayScore);
  if (home !== undefined) data.home_score = home;
  if (away !== undefined) data.away_score = away;
  if (parsed.data.status) data.status = parsed.data.status;
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes;
  if (parsed.data.location) data.location = parsed.data.location;
  if (parsed.data.busTime !== undefined) {
    data.bus_time = parsed.data.busTime ? new Date(parsed.data.busTime) : null;
  }

  try {
    const fixture = await db.fixture.update({
      where: { id },
      data,
      include: fixtureInclude,
    });
    return NextResponse.json({
      success: true,
      fixture: serializeFixture(fixture),
    });
  } catch {
    return jsonError('Failed to update fixture details', 500);
  }
}
