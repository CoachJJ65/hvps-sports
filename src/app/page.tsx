import Link from 'next/link';
import { CalendarDays, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  {
    href: '/fixtures',
    title: 'Fixtures',
    body: 'This week’s matches and kick-off times.',
    icon: CalendarDays,
  },
  {
    href: '/teams',
    title: 'Teams',
    body: 'Squads, age groups, and coaches.',
    icon: Users,
  },
  {
    href: '/results',
    title: 'Results',
    body: 'Scores and standings as they land.',
    icon: Trophy,
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="pt-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          HVPS
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Sports</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Fixtures, teams, and results in your pocket. Add to home screen for
          the full app experience.
        </p>
      </header>

      <section className="mt-8 grid gap-3" aria-label="Shortcuts">
        {actions.map(({ href, title, body, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-medium">{title}</span>
              <span className="block text-sm text-muted-foreground">{body}</span>
            </span>
          </Link>
        ))}
      </section>

      <div className="mt-auto py-8">
        <Button asChild className="w-full">
          <Link href="/auth/signin">Coach / admin sign in</Link>
        </Button>
      </div>
    </main>
  );
}
