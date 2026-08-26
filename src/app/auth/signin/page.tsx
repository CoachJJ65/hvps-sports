'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'email' | 'pin'>('email');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
      redirect: false,
    });
    setPending(false);
    if (!result?.ok) {
      setError('Email or password is incorrect.');
      return;
    }
    router.push('/');
    router.refresh();
  }

  async function onPin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await signIn('pin', {
      pin: String(form.get('pin') ?? ''),
      email: String(form.get('email') ?? ''),
      redirect: false,
    });
    setPending(false);
    if (!result?.ok) {
      setError('PIN is incorrect.');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <h1 className="pt-4 text-2xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Coaches can use email or a 4-digit PIN. Parents register first.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {(['email', 'pin'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setMode(value);
              setError(null);
            }}
            className={cn(
              'min-h-11 rounded-md border text-sm',
              mode === value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card'
            )}
          >
            {value === 'email' ? 'Email' : 'PIN'}
          </button>
        ))}
      </div>

      {mode === 'email' ? (
        <form onSubmit={(event) => void onEmail(event)} className="mt-6 space-y-4">
          <label className="block text-sm font-medium" htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
            />
          </label>
          <label className="block text-sm font-medium" htmlFor="password">
            Password
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
            />
          </label>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      ) : (
        <form onSubmit={(event) => void onPin(event)} className="mt-6 space-y-4">
          <label className="block text-sm font-medium" htmlFor="pin-email">
            Email (optional)
            <input
              id="pin-email"
              name="email"
              type="email"
              autoComplete="email"
              className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
            />
          </label>
          <label className="block text-sm font-medium" htmlFor="pin">
            PIN
            <input
              id="pin"
              name="pin"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              minLength={4}
              maxLength={8}
              className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
            />
          </label>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in with PIN'}
          </Button>
        </form>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        Parent without an account?{' '}
        <Link href="/auth/register" className="text-primary">
          Register
        </Link>
      </p>
    </main>
  );
}
