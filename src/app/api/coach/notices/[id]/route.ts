import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;

  const { id } = await params;
  try {
    await db.notice.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: 'Notice deleted successfully',
    });
  } catch {
    return jsonError('Failed to delete notice', 500);
  }
}
