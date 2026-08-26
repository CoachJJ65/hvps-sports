# HVPS Sports

Mobile-first PWA for HVPS sports. Stack matches `jjcriccrm`: Next.js 15, React 19, TypeScript, Tailwind 4, shadcn/ui (New York), Prisma + SQLite, NextAuth, TanStack Query, Zustand, Zod, custom `server.ts` + Socket.IO.

## Commands

- `npm run dev` — Next + Socket.IO via nodemon/tsx
- `npm run build` / `npm start`
- `npm run type-check`
- `npm run db:generate` / `npm run db:push` / `npm run db:seed`

Do not run `prisma migrate reset` or delete existing `.db` files if they contain real data.

## PWA

- Manifest: `src/app/manifest.ts`
- Service worker: `public/sw.js`
- Install prompt + bottom nav are mobile-first
