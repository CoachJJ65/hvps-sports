import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { db } from '@/lib/db';
import { jsonError, requireRole, EXEC_ROLES } from '@/lib/roles';
import { registerSchema } from '@/lib/validations';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, password, pin, role } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  let targetRole: Role = Role.PARENT;

  if (role && role !== 'PARENT') {
    const auth = await requireRole(EXEC_ROLES);
    if (auth.error) return auth.error;
    targetRole = role as Role;
  }

  try {
    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return jsonError('An account with this email address already exists');
    }

    const password_hash = await bcrypt.hash(password, 12);
    const pin_hash = pin ? await bcrypt.hash(pin, 12) : null;

    const user = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        password_hash,
        pin_hash,
        role: targetRole,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          hasPin: Boolean(user.pin_hash),
        },
      },
      { status: 201 }
    );
  } catch {
    return jsonError('Failed to create user account', 500);
  }
}
