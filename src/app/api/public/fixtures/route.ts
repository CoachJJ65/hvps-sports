import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError } from '@/lib/roles';
import { fixtureInclude, serializeFixture } from '@/lib/sports';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const fixtures = await db.fixture.findMany({
      include: fixtureInclude,
      orderBy: { date_time: 'asc' },
    });
    return NextResponse.json(fixtures.map(serializeFixture));
  } catch {
    return jsonError('Failed to fetch fixtures', 500);
  }
}
