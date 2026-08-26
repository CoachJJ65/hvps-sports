export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold">You’re offline</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        HVPS Sports will reload this page when the connection comes back.
      </p>
    </main>
  );
}
