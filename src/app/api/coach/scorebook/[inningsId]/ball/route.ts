import { NextResponse } from 'next/server';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { recordDelivery, undoLastDelivery } from '@/lib/scorebook';
import { cricketBallSchema } from '@/lib/validations';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ inningsId: string }> }
) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;
  const { inningsId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = cricketBallSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid delivery');

  try {
    const book = await recordDelivery({
      inningsId,
      input: {
        runsOffBat: parsed.data.runsOffBat,
        extraType: parsed.data.extraType ?? null,
        extraRuns: parsed.data.extraRuns,
        wicketType: parsed.data.wicketType ?? null,
        dismissedId: parsed.data.dismissedId ?? null,
      },
      newBatter: parsed.data.newBatter,
      nextBowlerId: parsed.data.nextBowlerId,
      fielderName: parsed.data.fielderName,
    });
    return NextResponse.json(book);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to record ball';
    return jsonError(message, 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ inningsId: string }> }
) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;
  const { inningsId } = await params;
  try {
    const book = await undoLastDelivery(inningsId);
    return NextResponse.json(book);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to undo';
    return jsonError(message, 400);
  }
}
