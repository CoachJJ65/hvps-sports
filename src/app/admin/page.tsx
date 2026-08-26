'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormViewer } from '@/components/sports/form-viewer';
import { isExec } from '@/lib/role-names';
import { cn } from '@/lib/utils';
import type { FormItem } from '@/types/sports';

interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  hasPin: boolean;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<'USERS' | 'FORMS'>('FORMS');
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [forms, setForms] = useState<FormItem[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin');
    if (status === 'authenticated' && !isExec(session?.user?.role)) {
      router.replace('/coach');
    }
  }, [status, session, router]);

  async function loadUsers() {
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers((await res.json()) as DirectoryUser[]);
  }

  async function loadForms() {
    const res = await fetch('/api/admin/forms');
    if (res.ok) setForms((await res.json()) as FormItem[]);
  }

  useEffect(() => {
    if (status === 'authenticated' && isExec(session?.user?.role)) {
      void loadUsers();
      void loadForms();
    }
  }, [status, session]);

  if (status !== 'authenticated' || !isExec(session?.user?.role)) {
    return (
      <main className="px-4 pt-8">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </main>
    );
  }

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <h1 className="pt-4 text-2xl font-semibold">Executive desk</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {session.user.name} · {session.user.role.replaceAll('_', ' ')}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {(['FORMS', 'USERS'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              'min-h-11 rounded-md border text-sm',
              tab === value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card'
            )}
          >
            {value === 'FORMS' ? 'Forms studio' : 'Users'}
          </button>
        ))}
      </div>
      {tab === 'USERS' ? (
        <UsersPanel
          users={users}
          canDelete={session.user.role === 'ADMIN'}
          selfId={session.user.id}
          onChanged={loadUsers}
        />
      ) : (
        <FormsStudio forms={forms} onChanged={loadForms} />
      )}
    </main>
  );
}

function UsersPanel({
  users,
  canDelete,
  selfId,
  onChanged,
}: {
  users: DirectoryUser[];
  canDelete: boolean;
  selfId: string;
  onChanged: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('COACH');
  const [pin, setPin] = useState('');

  async function createUser(event: FormEvent) {
    event.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        pin: pin || undefined,
      }),
    });
    if (res.ok) {
      toast.success(`Added ${name}`);
      setName('');
      setEmail('');
      setPassword('');
      setPin('');
      onChanged();
    } else {
      const data = (await res.json()) as { error?: string };
      toast.error(data.error ?? 'Could not create user');
    }
  }

  async function remove(id: string, target: string) {
    if (!window.confirm(`Delete ${target}?`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(`Deleted ${target}`);
      onChanged();
    } else {
      toast.error('Could not delete user');
    }
  }

  return (
    <section className="mt-4 space-y-4">
      <form
        onSubmit={(event) => void createUser(event)}
        className="space-y-3 rounded-xl border border-border bg-card p-4"
      >
        <h2 className="font-medium">Add staff or parent</h2>
        <input
          className="min-h-11 w-full rounded-md border border-input bg-background px-3"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          className="min-h-11 w-full rounded-md border border-input bg-background px-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="min-h-11 w-full rounded-md border border-input bg-background px-3"
          placeholder="Password (min 8)"
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <input
          className="min-h-11 w-full rounded-md border border-input bg-background px-3"
          placeholder="PIN (optional)"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
        />
        <select
          className="min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="COACH">Coach</option>
          <option value="PARENT">Parent</option>
          <option value="HOD_SPORTS">HOD Sports</option>
          <option value="HEAD_OF_SPORTS">Head of Sports</option>
          <option value="ADMIN">Admin</option>
        </select>
        <Button className="w-full" type="submit">
          Create account
        </Button>
      </form>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between gap-2 px-4 py-3">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                {user.email} · {user.role.replaceAll('_', ' ')}
                {user.hasPin ? ' · PIN' : ''}
              </p>
            </div>
            {canDelete && user.id !== selfId ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => void remove(user.id, user.name)}
              >
                Delete
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function FormsStudio({
  forms,
  onChanged,
}: {
  forms: FormItem[];
  onChanged: () => void;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('GENERAL');
  const [body, setBody] = useState('');
  const [selected, setSelected] = useState<FormItem | null>(null);

  async function publish(event: FormEvent) {
    event.preventDefault();
    const contentJson =
      type === 'GENERAL' || type === 'TEAM_SHEET'
        ? { body }
        : { title, generalRules: body.split('\n').filter(Boolean) };
    const res = await fetch('/api/admin/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        type,
        contentJson,
        isPublished: true,
      }),
    });
    if (res.ok) {
      toast.success('Form published');
      setTitle('');
      setBody('');
      onChanged();
    } else {
      toast.error('Could not publish form');
    }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete ${name}?`)) return;
    const res = await fetch(`/api/admin/forms/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      onChanged();
    } else {
      toast.error('Could not delete form');
    }
  }

  if (selected) {
    return (
      <div className="mt-4">
        <FormViewer form={selected} onClose={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <section className="mt-4 space-y-4">
      <form
        onSubmit={(event) => void publish(event)}
        className="space-y-3 rounded-xl border border-border bg-card p-4"
      >
        <h2 className="font-medium">Publish a planner or form</h2>
        <input
          className="min-h-11 w-full rounded-md border border-input bg-background px-3"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <select
          className="min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="GENERAL">General</option>
          <option value="TOURNAMENT_SCHEDULE">Tournament schedule</option>
          <option value="COACHES_PLANNER">Coaches planner</option>
          <option value="RUGBY_RULES">Rugby rules</option>
          <option value="TEAM_SHEET">Team sheet</option>
        </select>
        <textarea
          className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Body or one rule per line"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
        />
        <Button className="w-full" type="submit">
          Publish
        </Button>
      </form>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {forms.map((form) => (
          <li key={form.id} className="flex items-center justify-between gap-2 px-4 py-3">
            <button
              type="button"
              className="flex-1 text-left"
              onClick={() => setSelected(form)}
            >
              <span className="block font-medium">{form.title}</span>
              <span className="block text-sm text-muted-foreground">
                {form.type.replaceAll('_', ' ')}
                {form.isPublished ? '' : ' · draft'}
              </span>
            </button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void remove(form.id, form.title)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
