import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { jsonError, requireRole, EXEC_ROLES } from '@/lib/roles';
import { formDocumentUpdateSchema } from '@/lib/validations';
import { formInclude, serializeForm } from '@/lib/sports';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireRole(EXEC_ROLES);
  if (error || !session) return error;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = formDocumentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Invalid form update');
  }

  const data: Prisma.FormDocumentUpdateInput = {};
  if (parsed.data.title !== undefined) data.title = parsed.data.title;
  if (parsed.data.type !== undefined) data.type = parsed.data.type;
  if (parsed.data.sportId !== undefined) {
    data.sport = parsed.data.sportId
      ? { connect: { id: parsed.data.sportId } }
      : { disconnect: true };
  }
  if (parsed.data.contentJson !== undefined) {
    data.content_json =
      typeof parsed.data.contentJson === 'string'
        ? parsed.data.contentJson
        : JSON.stringify(parsed.data.contentJson);
  }
  if (parsed.data.isPublished !== undefined) {
    data.is_published = parsed.data.isPublished;
  }

  try {
    const form = await db.formDocument.update({
      where: { id },
      data,
      include: formInclude,
    });
    return NextResponse.json({ success: true, form: serializeForm(form) });
  } catch {
    return jsonError('Failed to update form document', 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireRole(EXEC_ROLES);
  if (error || !session) return error;

  const { id } = await params;
  try {
    await db.formDocument.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: 'Form document deleted successfully',
    });
  } catch {
    return jsonError('Failed to delete form document', 500);
  }
}
