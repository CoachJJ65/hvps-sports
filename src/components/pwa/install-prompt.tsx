'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/ui';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const { installDismissed, setInstallDismissed } = useUiStore();

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!event || installDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 rounded-xl border border-border bg-card p-3 shadow-lg">
      <p className="text-sm font-medium">Install HVPS Sports</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Add to your home screen for one-tap access, even offline.
      </p>
      <div className="mt-3 flex gap-2">
        <Button
          className="flex-1"
          onClick={async () => {
            await event.prompt();
            setEvent(null);
          }}
        >
          <Download />
          Install
        </Button>
        <Button
          variant="ghost"
          onClick={() => setInstallDismissed(true)}
        >
          Not now
        </Button>
      </div>
    </div>
  );
}
