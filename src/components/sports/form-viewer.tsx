'use client';

import { FileText, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FormItem } from '@/types/sports';

function parseContent(raw: string) {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item));
}

export function FormViewer({
  form,
  onClose,
}: {
  form: FormItem;
  onClose?: () => void;
}) {
  const parsed = parseContent(form.contentJson);
  const duties = Array.isArray(parsed.duties)
    ? (parsed.duties as Record<string, string>[])
    : [];
  const fixtures = Array.isArray(parsed.fixtures)
    ? (parsed.fixtures as Record<string, string>[])
    : [];

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3 no-print">
        <div className="flex items-start gap-2">
          <FileText className="mt-0.5 size-5 text-primary" aria-hidden />
          <div>
            <h1 className="text-xl font-semibold leading-tight">{form.title}</h1>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {form.type.replaceAll('_', ' ')}
              {form.author?.name ? ` · ${form.author.name}` : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer />
            Print
          </Button>
          {onClose ? (
            <Button type="button" variant="ghost" size="icon" onClick={onClose}>
              <X />
              <span className="sr-only">Close</span>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 text-sm print:border-0 print:bg-white print:text-black">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Hurlyvale Primary School
        </p>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Sports department — official document
        </p>

        {form.type === 'TOURNAMENT_SCHEDULE' ? (
          <div className="mt-4 space-y-3">
            {parsed.eventTitle ? (
              <h2 className="text-lg font-semibold">{String(parsed.eventTitle)}</h2>
            ) : null}
            <p className="text-muted-foreground">
              {parsed.date ? String(parsed.date) : ''}
              {parsed.timeRange ? ` · ${String(parsed.timeRange)}` : ''}
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {asStringList(parsed.generalRules).map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <div className="overflow-x-auto">
              <table className="mt-3 w-full min-w-[28rem] text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 pr-2">Pool</th>
                    <th className="py-2 pr-2">Time</th>
                    <th className="py-2 pr-2">Match</th>
                    <th className="py-2">Field</th>
                  </tr>
                </thead>
                <tbody>
                  {fixtures.map((row, index) => (
                    <tr key={`${row.time}-${index}`} className="border-b border-border/60">
                      <td className="py-2 pr-2">{row.pool}</td>
                      <td className="py-2 pr-2">{row.time}</td>
                      <td className="py-2 pr-2">
                        {row.team1} vs {row.team2}
                      </td>
                      <td className="py-2">{row.field}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {form.type === 'COACHES_PLANNER' ? (
          <div className="mt-4 space-y-3">
            <h2 className="text-lg font-semibold">
              {parsed.title ? String(parsed.title) : form.title}
            </h2>
            {parsed.location ? (
              <p className="text-muted-foreground">{String(parsed.location)}</p>
            ) : null}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 pr-2">Day</th>
                    <th className="py-2 pr-2">Team</th>
                    <th className="py-2 pr-2">Time</th>
                    <th className="py-2 pr-2">Opposition</th>
                    <th className="py-2 pr-2">Coach</th>
                    <th className="py-2">Referee</th>
                  </tr>
                </thead>
                <tbody>
                  {duties.map((row, index) => (
                    <tr key={`${row.team}-${index}`} className="border-b border-border/60">
                      <td className="py-2 pr-2">{row.day}</td>
                      <td className="py-2 pr-2">{row.team}</td>
                      <td className="py-2 pr-2">{row.time}</td>
                      <td className="py-2 pr-2">{row.opposition}</td>
                      <td className="py-2 pr-2">{row.coach}</td>
                      <td className="py-2">{row.referee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {form.type === 'RUGBY_RULES' ? (
          <div className="mt-4 space-y-4">
            {parsed.title ? (
              <h2 className="text-lg font-semibold">{String(parsed.title)}</h2>
            ) : null}
            <div>
              <h3 className="font-medium">U7 tag laws</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {asStringList(parsed.u7Rules).map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">U8 tag laws</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {asStringList(parsed.u8Rules).map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {form.type === 'GENERAL' || form.type === 'TEAM_SHEET' ? (
          <div className="mt-4 whitespace-pre-wrap">
            {typeof parsed.body === 'string'
              ? parsed.body
              : JSON.stringify(parsed, null, 2)}
          </div>
        ) : null}
      </div>
    </section>
  );
}
