import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { noticeSchema } from '@/lib/validations';
import { serializeNotice } from '@/lib/sports';

export async function POST(request: Request) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = noticeSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Title and content are required');
  }

  try {
    const notice = await db.notice.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        type: parsed.data.type ?? 'GENERAL',
      },
    });
    return NextResponse.json({ success: true, notice: serializeNotice(notice) });
  } catch {
    return jsonError('Failed to create notice', 500);
  }
}
