import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireSession } from '@/lib/roles';
import { serializePlayer } from '@/lib/sports';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session) return error;

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        children: {
          include: {
            team: { include: { sport: true } },
          },
        },
      },
    });
    if (!user) return jsonError('User not found', 404);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasPin: Boolean(user.pin_hash),
      children: user.children.map((child) => ({
        ...serializePlayer(child),
        team: child.team
          ? {
              id: child.team.id,
              name: child.team.name,
              sport: { id: child.team.sport.id, name: child.team.sport.name },
            }
          : null,
      })),
    });
  } catch {
    return jsonError('Failed to fetch user profile', 500);
  }
}
