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

## Coolify

Production is Docker on Coolify. See [COOLIFY.md](./COOLIFY.md) for GitHub app setup, env vars (`XAI_API_KEY`, `NEXTAUTH_URL`, `DATABASE_URL`), websocket proxy, and the SQLite volume at `/app/prisma/db`.

## AI (Grok)

All AI features use **xAI Grok** only (`XAI_API_KEY`, model `grok-4.6`). Get a key at [console.x.ai](https://console.x.ai). Keep it in `.env` — never in the browser.

`POST /api/ai/chat` with `{ "prompt": "..." }` is the server entry point.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with Socket.IO |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run type-check` | `tsc --noEmit` |
| `npm run db:push` | Apply Prisma schema |
| `npm run db:seed` | Seed admin user |
