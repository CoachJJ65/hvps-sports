import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import QueryProvider from '@/components/providers/query-provider';
import SessionProviderWrapper from '@/components/providers/session-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { BottomNav } from '@/components/layout/bottom-nav';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { PwaRegister } from '@/components/pwa/pwa-register';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'HVPS Sports',
    template: '%s | HVPS Sports',
  },
  description:
    'Mobile-first sports hub for Hurlyvale Primary — fixtures, teams, notices, attendance, and match-day planners.',
  applicationName: 'HVPS Sports',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HVPS Sports',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#071910',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-background text-foreground`}
      >
        <QueryProvider>
          <ThemeProvider>
            <SessionProviderWrapper>
              <PwaRegister />
              <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:max-w-5xl md:pb-0">
                {children}
              </div>
              <BottomNav />
              <InstallPrompt />
              <Toaster richColors position="top-center" />
            </SessionProviderWrapper>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
