import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError } from '@/lib/roles';
import { serializeNotice } from '@/lib/sports';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notices = await db.notice.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(notices.map(serializeNotice));
  } catch {
    return jsonError('Failed to fetch notices', 500);
  }
}
