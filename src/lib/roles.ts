import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export { EXEC_ROLES, isExec, isStaff, STAFF_ROLES } from '@/lib/role-names';

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { session, error: null };
}

export async function requireRole(allowed: readonly string[]) {
  const { session, error } = await requireSession();
  if (error || !session) {
    return { session: null, error: error ?? NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!allowed.includes(session.user.role)) {
    return {
      session: null,
      error: NextResponse.json(
        { error: 'Access denied: insufficient permissions' },
        { status: 403 }
      ),
    };
  }
  return { session, error: null };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
