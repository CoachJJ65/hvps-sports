import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { selectionsSchema } from '@/lib/validations';

export async function POST(request: Request) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = selectionsSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Invalid selections payload');
  }

  try {
    await db.selection.deleteMany({
      where: { fixture_id: parsed.data.fixtureId },
    });
    const created = await db.selection.createMany({
      data: parsed.data.selections.map((sel) => ({
        fixture_id: parsed.data.fixtureId,
        player_id: sel.playerId,
        position: sel.position ?? null,
      })),
    });
    return NextResponse.json({ success: true, count: created.count });
  } catch {
    return jsonError('Failed to save squad selections', 500);
  }
}
