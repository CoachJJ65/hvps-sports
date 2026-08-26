import Link from 'next/link';

export default function MorePage() {
  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <h1 className="pt-4 text-2xl font-semibold">More</h1>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
        <li>
          <Link className="block min-h-14 px-4 py-4" href="/results">
            Results
          </Link>
        </li>
        <li>
          <Link className="block min-h-14 px-4 py-4" href="/auth/signin">
            Sign in
          </Link>
        </li>
      </ul>
    </main>
  );
}
