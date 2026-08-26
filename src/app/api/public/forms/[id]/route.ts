import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError } from '@/lib/roles';
import { formInclude, serializeForm } from '@/lib/sports';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const form = await db.formDocument.findUnique({
      where: { id },
      include: formInclude,
    });
    if (!form || !form.is_published) {
      return jsonError('Form document not found', 404);
    }
    return NextResponse.json(serializeForm(form));
  } catch {
    return jsonError('Failed to fetch form document details', 500);
  }
}
