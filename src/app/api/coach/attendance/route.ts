import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { attendanceSchema } from '@/lib/validations';

export async function POST(request: Request) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = attendanceSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Missing required attendance fields');
  }

  try {
    const attendance = await db.attendance.create({
      data: {
        team_id: parsed.data.teamId,
        date: new Date(parsed.data.date),
        coach_id: session.user.id,
        records: JSON.stringify(parsed.data.records),
      },
    });
    return NextResponse.json({ success: true, attendance });
  } catch {
    return jsonError('Failed to record attendance', 500);
  }
}
