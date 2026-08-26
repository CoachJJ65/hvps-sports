'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '');
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const pin = String(form.get('pin') ?? '').trim();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        pin: pin || undefined,
        role: 'PARENT',
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setPending(false);
      setError(data.error ?? 'Could not create account');
      return;
    }

    const login = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setPending(false);
    if (!login?.ok) {
      router.push('/auth/signin');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <h1 className="pt-4 text-2xl font-semibold">Parent register</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create a parent account to follow notices and team sheets. Staff
        accounts are created by the sports desk.
      </p>
      <form onSubmit={(event) => void onSubmit(event)} className="mt-6 space-y-4">
        <label className="block text-sm font-medium" htmlFor="name">
          Name
          <input
            id="name"
            name="name"
            required
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          />
        </label>
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
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          />
        </label>
        <label className="block text-sm font-medium" htmlFor="pin">
          Optional PIN
          <input
            id="pin"
            name="pin"
            inputMode="numeric"
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
          {pending ? 'Creating account…' : 'Register'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/signin" className="text-primary">
          Sign in
        </Link>
      </p>
    </main>
  );
}
