import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError } from '@/lib/roles';
import { formInclude, serializeForm } from '@/lib/sports';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const forms = await db.formDocument.findMany({
      where: { is_published: true },
      include: formInclude,
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(forms.map(serializeForm));
  } catch {
    return jsonError('Failed to fetch form documents', 500);
  }
}
