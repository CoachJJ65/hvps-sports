'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { isExec, isStaff } from '@/lib/role-names';

export default function MorePage() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <h1 className="pt-4 text-2xl font-semibold">More</h1>
      {session?.user ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as {session.user.name} ({role?.replaceAll('_', ' ')})
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Notices, planners, and staff tools.
        </p>
      )}

      <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
        <MoreLink href="/results" label="Results" />
        <MoreLink href="/forms" label="Forms & planners" />
        {isStaff(role) ? <MoreLink href="/coach" label="Coach room" /> : null}
        {isExec(role) ? <MoreLink href="/admin" label="Executive desk" /> : null}
        {session?.user ? (
          <li>
            <button
              type="button"
              className="block min-h-14 w-full px-4 py-4 text-left"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign out
            </button>
          </li>
        ) : (
          <>
            <MoreLink href="/auth/signin" label="Sign in" />
            <MoreLink href="/auth/register" label="Parent register" />
          </>
        )}
      </ul>
    </main>
  );
}

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link className="block min-h-14 px-4 py-4" href={href}>
        {label}
      </Link>
    </li>
  );
}
