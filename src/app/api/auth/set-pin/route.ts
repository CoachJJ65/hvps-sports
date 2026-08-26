import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { jsonError, requireSession } from '@/lib/roles';
import { setPinSchema } from '@/lib/validations';

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = setPinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'PIN must be 4–8 characters' },
      { status: 422 }
    );
  }

  try {
    const pin = parsed.data.pin?.trim();
    const pin_hash = pin ? await bcrypt.hash(pin, 12) : null;
    await db.user.update({
      where: { id: session.user.id },
      data: { pin_hash },
    });
    return NextResponse.json({
      success: true,
      hasPin: Boolean(pin_hash),
      message: pin_hash ? 'PIN set successfully' : 'PIN removed successfully',
    });
  } catch {
    return jsonError('Failed to update PIN code', 500);
  }
}
