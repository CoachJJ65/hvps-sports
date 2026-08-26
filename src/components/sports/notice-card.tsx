import { Megaphone, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NoticeItem } from '@/types/sports';

export function NoticeCard({ notice }: { notice: NoticeItem }) {
  const alert = notice.type === 'LIGHTNING' || notice.type === 'WEATHER';
  return (
    <article
      className={cn(
        'rounded-xl border p-4',
        alert
          ? 'border-destructive/40 bg-destructive/10'
          : 'border-border bg-card'
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg',
            alert ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-primary'
          )}
        >
          {alert ? (
            <ShieldAlert className="size-4" aria-hidden />
          ) : (
            <Megaphone className="size-4" aria-hidden />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {notice.type.replace('_', ' ')}
          </p>
          <h2 className="mt-0.5 font-medium leading-snug">{notice.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{notice.content}</p>
        </div>
      </div>
    </article>
  );
}
