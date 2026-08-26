import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole } from '@/lib/roles';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireRole(['ADMIN']);
  if (error || !session) return error;

  const { id } = await params;
  if (id === session.user.id) {
    return jsonError('You cannot delete your own account');
  }

  try {
    await db.user.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch {
    return jsonError('Failed to delete user', 500);
  }
}
