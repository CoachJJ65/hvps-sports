# Graph Report - Hvps_Sports  (2026-08-26)

## Corpus Check
- 58 files · ~16,196 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 319 nodes · 335 edges · 43 communities (30 shown, 13 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2a4cfd6b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_App Shell Providers|App Shell Providers]]
- [[_COMMUNITY_Dev Tooling|Dev Tooling]]
- [[_COMMUNITY_shadcn Config|shadcn Config]]
- [[_COMMUNITY_NPM Scripts|NPM Scripts]]
- [[_COMMUNITY_Mobile UI Shell|Mobile UI Shell]]
- [[_COMMUNITY_Apple Touch Icon|Apple Touch Icon]]
- [[_COMMUNITY_PWA Icon 512|PWA Icon 512]]
- [[_COMMUNITY_Icon Source SVG|Icon Source SVG]]
- [[_COMMUNITY_PWA Icon 192|PWA Icon 192]]
- [[_COMMUNITY_Auth and Prisma|Auth and Prisma]]
- [[_COMMUNITY_NextAuth Types|NextAuth Types]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Custom Server|Custom Server]]
- [[_COMMUNITY_Prisma Seed|Prisma Seed]]
- [[_COMMUNITY_Product Identity|Product Identity]]
- [[_COMMUNITY_Icon Generator|Icon Generator]]
- [[_COMMUNITY_Sign-In Validation|Sign-In Validation]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_Service Worker|Service Worker]]
- [[_COMMUNITY_graphify reference extra exports and benchmark|graphify reference: extra exports and benchmark]]
- [[_COMMUNITY_graphify reference query, path, explain|graphify reference: query, path, explain]]
- [[_COMMUNITY_HVPS Sports|HVPS Sports]]
- [[_COMMUNITY_graphify reference add a URL and watch a folder|graphify reference: add a URL and watch a folder]]
- [[_COMMUNITY_graphify reference commit hook and native CLAUDE.md integration|graphify reference: commit hook and native CLAUDE.md integration]]
- [[_COMMUNITY_graphify reference incremental update and cluster-only|graphify reference: incremental update and cluster-only]]
- [[_COMMUNITY_graphify reference GitHub clone and cross-repo merge|graphify reference: GitHub clone and cross-repo merge]]
- [[_COMMUNITY_graphify reference transcribe video and audio|graphify reference: transcribe video and audio]]
- [[_COMMUNITY_CLAUDE|CLAUDE.md]]
- [[_COMMUNITY_CLAUDE|CLAUDE.md]]
- [[_COMMUNITY_extraction-spec|extraction-spec.md]]
- [[_COMMUNITY_GEMINI|GEMINI.md]]
- [[_COMMUNITY_graphify|graphify.md]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `scripts` - 13 edges
3. `What You Must Do When Invoked` - 12 edges
4. `/graphify` - 11 edges
5. `graphify reference: extra exports and benchmark` - 8 edges
6. `grokModelName()` - 6 edges
7. `tailwind` - 6 edges
8. `aliases` - 6 edges
9. `Button()` - 6 edges
10. `HVPS Sports Apple Touch Icon` - 6 edges

## Surprising Connections (you probably didn't know these)
- `start()` --calls--> `setupSocket()`  [EXTRACTED]
  server.ts → src/lib/socket.ts
- `POST()` --calls--> `grokModel()`  [EXTRACTED]
  src/app/api/ai/chat/route.ts → src/lib/ai.ts
- `POST()` --calls--> `grokModelName()`  [EXTRACTED]
  src/app/api/ai/chat/route.ts → src/lib/ai.ts
- `POST()` --calls--> `isGrokConfigured()`  [EXTRACTED]
  src/app/api/ai/chat/route.ts → src/lib/ai.ts
- `GET()` --calls--> `grokModelName()`  [EXTRACTED]
  src/app/api/health/route.ts → src/lib/ai.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Apple Touch Icon Brand Lockup** — public_apple_touch_icon_app_icon, public_apple_touch_icon_rounded_square_canvas, public_apple_touch_icon_dark_forest_field, public_apple_touch_icon_hvps_mark, public_apple_touch_icon_lime_stroke [EXTRACTED 1.00]
- **Centered Circle-Plus Glyph** — public_apple_touch_icon_hvps_mark, public_apple_touch_icon_circle_plus_glyph, public_apple_touch_icon_lime_stroke [EXTRACTED 1.00]
- **HVPS Sports 192px PWA Icon Composition** — public_icon_192_pwa_icon, public_icon_192_rounded_dark_canvas, public_icon_192_circled_plus_glyph [EXTRACTED 1.00]
- **Composed Plus-in-Circle Icon** — public_icon_512_rounded_square_canvas, public_icon_512_dark_green_field, public_icon_512_lime_circle_ring, public_icon_512_lime_plus_mark [EXTRACTED 1.00]
- **Two-Color Icon Palette** — public_icon_512_two_color_palette, public_icon_512_dark_green_field, public_icon_512_lime_circle_ring, public_icon_512_lime_plus_mark [INFERRED 0.85]
- **HVPS Sports App Mark** — public_icon_pitch_green_square, public_icon_lime_circle, public_icon_lime_crosshair [EXTRACTED 1.00]

## Communities (43 total, 13 thin omitted)

### Community 0 - "Runtime Dependencies"
Cohesion: 0.06
Nodes (32): AI — Grok only, dependencies, ai, @ai-sdk/xai, bcryptjs, class-variance-authority, clsx, date-fns (+24 more)

### Community 1 - "TypeScript Config"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+13 more)

### Community 2 - "App Shell Providers"
Cohesion: 0.09
Nodes (18): geistMono, geistSans, metadata, viewport, actions, BottomNav(), items, QueryProvider() (+10 more)

### Community 3 - "Dev Tooling"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, nodemon, prettier, tailwindcss, @tailwindcss/postcss (+5 more)

### Community 4 - "shadcn Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 5 - "NPM Scripts"
Cohesion: 0.11
Nodes (18): name, prisma, seed, private, scripts, build, db:generate, db:push (+10 more)

### Community 6 - "Mobile UI Shell"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 7 - "Apple Touch Icon"
Cohesion: 0.39
Nodes (9): HVPS Sports Apple Touch Icon, Circle with Inscribed Plus, Dark Forest-Green Field, HVPS Circle-Plus Brand Mark, HVPS Sports Brand, iOS Home Screen / Apple Web App Icon, Lime Chartreuse Stroke, iOS Rounded-Square Icon Canvas (+1 more)

### Community 8 - "PWA Icon 512"
Cohesion: 0.47
Nodes (9): Centered Composition, Dark Green Field, Flat Geometric Icon Style, Lime Circle Ring, Lime Plus Mark, PWA App Icon 512, PWA Launcher Identity, Rounded Square Canvas (+1 more)

### Community 9 - "Icon Source SVG"
Cohesion: 0.36
Nodes (9): HVPS Sports App Icon, Lime Accent, Lime Circle, Lime Crosshair, Pitch Green, Pitch-Green Rounded Square, PWA Icon Source, Rounded Square App Icon Format (+1 more)

### Community 10 - "PWA Icon 192"
Cohesion: 0.47
Nodes (6): Lime Circled-Plus Glyph, HVPS Sports Brand Identity, Lime on Forest Palette, Maskable Safe Layout, HVPS Sports 192px PWA Icon, Rounded Dark Forest Canvas

### Community 11 - "Auth and Prisma"
Cohesion: 0.40
Nodes (3): handler, authOptions, globalForPrisma

### Community 12 - "NextAuth Types"
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

### Community 13 - "ESLint Config"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 14 - "Custom Server"
Cohesion: 0.60
Nodes (3): port, start(), setupSocket()

### Community 17 - "Product Identity"
Cohesion: 0.40
Nodes (4): AI (Grok), HVPS Sports, Scripts, Setup

### Community 19 - "Sign-In Validation"
Cohesion: 0.28
Nodes (11): POST(), GET(), AI_PROVIDER, grokModel(), grokModelName(), isGrokConfigured(), requireGrokApiKey(), GrokChatInput (+3 more)

### Community 32 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 33 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 34 - "HVPS Sports"
Cohesion: 0.33
Nodes (5): AI (Grok only), Commands, graphify, HVPS Sports, PWA

### Community 35 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 36 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 37 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **178 isolated node(s):** `AI — Grok only`, `Commands`, `AI (Grok only)`, `PWA`, `graphify` (+173 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `NPM Scripts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Tooling` to `NPM Scripts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `AI — Grok only`, `Commands`, `AI (Grok only)` to the rest of the system?**
  _179 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `App Shell Providers` be split into smaller, more focused modules?**
  _Cohesion score 0.0928030303030303 - nodes in this community are weakly interconnected._
- **Should `shadcn Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._