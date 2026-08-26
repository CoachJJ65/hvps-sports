# HVPS Sports

Mobile-first PWA for HVPS fixtures, teams, and results.

Same core stack as [jjcriccrm](https://github.com/CoachJJ65/jjcriccrm): Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma (SQLite), NextAuth, TanStack Query, Zustand, Zod, and a custom Node server with Socket.IO.

## Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000. On a phone, use Add to Home Screen to install the PWA.

Seeded admin (change immediately): `admin@hvps.local` / `changeme-admin`

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with Socket.IO |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run type-check` | `tsc --noEmit` |
| `npm run db:push` | Apply Prisma schema |
| `npm run db:seed` | Seed admin user |
