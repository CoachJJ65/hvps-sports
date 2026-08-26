import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, EXEC_ROLES } from '@/lib/roles';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { session, error } = await requireRole(EXEC_ROLES);
  if (error || !session) return error;

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        pin_hash: true,
        children: {
          select: { id: true, first_name: true, last_name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at.toISOString(),
        hasPin: Boolean(user.pin_hash),
        children: user.children.map((child) => ({
          id: child.id,
          firstName: child.first_name,
          lastName: child.last_name,
        })),
      }))
    );
  } catch {
    return jsonError('Failed to fetch user directory', 500);
  }
}
