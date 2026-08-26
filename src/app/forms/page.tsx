'use client';

import { useState } from 'react';
import { FormViewer } from '@/components/sports/form-viewer';
import { useCachedJson } from '@/lib/use-cached-json';
import type { FormItem } from '@/types/sports';

export default function FormsPage() {
  const { data: forms, loading } = useCachedJson<FormItem>(
    'forms',
    '/api/public/forms'
  );
  const [selected, setSelected] = useState<FormItem | null>(null);

  if (selected) {
    return (
      <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
        <div className="pt-4">
          <FormViewer form={selected} onClose={() => setSelected(null)} />
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <h1 className="pt-4 text-2xl font-semibold">Forms & planners</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tournament schedules, coaches planners, and tag rugby laws.
      </p>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
        {loading && forms.length === 0 ? (
          <li className="px-4 py-4 text-sm text-muted-foreground">
            Loading documents…
          </li>
        ) : forms.length === 0 ? (
          <li className="px-4 py-4 text-sm text-muted-foreground">
            No published documents yet.
          </li>
        ) : (
          forms.map((form) => (
            <li key={form.id}>
              <button
                type="button"
                className="block min-h-14 w-full px-4 py-4 text-left"
                onClick={() => setSelected(form)}
              >
                <span className="block font-medium">{form.title}</span>
                <span className="block text-sm text-muted-foreground">
                  {form.type.replaceAll('_', ' ')}
                  {form.sport?.name ? ` · ${form.sport.name}` : ''}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
