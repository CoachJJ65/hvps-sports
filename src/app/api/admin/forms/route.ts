import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, EXEC_ROLES } from '@/lib/roles';
import { formDocumentSchema } from '@/lib/validations';
import { formInclude, serializeForm } from '@/lib/sports';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { session, error } = await requireRole(EXEC_ROLES);
  if (error || !session) return error;

  try {
    const forms = await db.formDocument.findMany({
      include: formInclude,
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(forms.map(serializeForm));
  } catch {
    return jsonError('Failed to fetch admin form list', 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireRole(EXEC_ROLES);
  if (error || !session) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = formDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Title, type, and content payload are required');
  }

  try {
    const form = await db.formDocument.create({
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        sport_id: parsed.data.sportId || null,
        author_id: session.user.id,
        content_json:
          typeof parsed.data.contentJson === 'string'
            ? parsed.data.contentJson
            : JSON.stringify(parsed.data.contentJson),
        is_published: parsed.data.isPublished ?? true,
      },
      include: formInclude,
    });
    return NextResponse.json(
      { success: true, form: serializeForm(form) },
      { status: 201 }
    );
  } catch {
    return jsonError('Failed to create form document', 500);
  }
}
