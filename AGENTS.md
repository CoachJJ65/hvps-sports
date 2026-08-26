# HVPS Sports

Mobile-first PWA for HVPS sports. Stack matches `jjcriccrm`: Next.js 15, React 19, TypeScript, Tailwind 4, shadcn/ui (New York), Prisma + SQLite, NextAuth, TanStack Query, Zustand, Zod, custom `server.ts` + Socket.IO.

## Commands

- `npm run dev` — Next + Socket.IO via nodemon/tsx
- `npm run build` / `npm start`
- `npm run type-check`
- `npm run db:generate` / `npm run db:push` / `npm run db:seed`

Do not run `prisma migrate reset` or delete existing `.db` files if they contain real data.

## AI (Grok only)

All LLM/AI features MUST use xAI Grok via `XAI_API_KEY` and `https://api.x.ai/v1`. Default model is `grok-4.6` (`XAI_MODEL` to override).

- Server-only: import from `src/lib/ai.ts`. Never put the key in client code.
- HTTP: `POST /api/ai/chat` with `{ "prompt": "..." }`.
- Do not add OpenAI, Anthropic, Gemini, or other providers.

## PWA

- Manifest: `src/app/manifest.ts`
- Service worker: `public/sw.js`
- Install prompt + bottom nav are mobile-first

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- Obsidian notes live in `C:\Users\coachJJ\Documents\Obsidian Vault\02 Projects\HVPS Sports Graph`. Re-export with `graphify export obsidian --dir "C:\Users\coachJJ\Documents\Obsidian Vault\02 Projects\HVPS Sports Graph"`.
