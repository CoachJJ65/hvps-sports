# Graph Report - C:\Users\coachJJ\Documents\Hvps_Sports  (2026-08-26)

## Corpus Check
- Corpus is ~15,672 words - fits in a single context window. You may not need a graph.

## Summary
- 229 nodes · 242 edges · 32 communities (25 shown, 7 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

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
- [[_COMMUNITY_Graphify Always-On|Graphify Always-On]]
- [[_COMMUNITY_Prisma Seed|Prisma Seed]]
- [[_COMMUNITY_Product Identity|Product Identity]]
- [[_COMMUNITY_Icon Generator|Icon Generator]]
- [[_COMMUNITY_Sign-In Validation|Sign-In Validation]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_Service Worker|Service Worker]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `scripts` - 13 edges
3. `tailwind` - 6 edges
4. `aliases` - 6 edges
5. `Button()` - 6 edges
6. `HVPS Sports Apple Touch Icon` - 6 edges
7. `PWA App Icon 512` - 6 edges
8. `Lime Plus Mark` - 6 edges
9. `HVPS Sports App Icon` - 6 edges
10. `cn()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `graphify always-on` --semantically_similar_to--> `graphify knowledge graph`  [INFERRED] [semantically similar]
  AGENTS.md → CLAUDE.md
- `Obsidian graphify export` --conceptually_related_to--> `graphify knowledge graph`  [INFERRED]
  .grok/rules/graphify.md → CLAUDE.md
- `start()` --calls--> `setupSocket()`  [EXTRACTED]
  server.ts → src/lib/socket.ts
- `BottomNav()` --calls--> `cn()`  [EXTRACTED]
  src/components/layout/bottom-nav.tsx → src/lib/utils.ts
- `InstallPrompt()` --calls--> `useUiStore`  [EXTRACTED]
  src/components/pwa/install-prompt.tsx → src/store/ui.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **HVPS Sports graphify always-on** — agents_md_graphify, claude_md_graphify, grok_rules_graphify_obsidian_export [EXTRACTED 1.00]
- **Apple Touch Icon Brand Lockup** — public_apple_touch_icon_app_icon, public_apple_touch_icon_rounded_square_canvas, public_apple_touch_icon_dark_forest_field, public_apple_touch_icon_hvps_mark, public_apple_touch_icon_lime_stroke [EXTRACTED 1.00]
- **Centered Circle-Plus Glyph** — public_apple_touch_icon_hvps_mark, public_apple_touch_icon_circle_plus_glyph, public_apple_touch_icon_lime_stroke [EXTRACTED 1.00]
- **HVPS Sports 192px PWA Icon Composition** — public_icon_192_pwa_icon, public_icon_192_rounded_dark_canvas, public_icon_192_circled_plus_glyph [EXTRACTED 1.00]
- **Composed Plus-in-Circle Icon** — public_icon_512_rounded_square_canvas, public_icon_512_dark_green_field, public_icon_512_lime_circle_ring, public_icon_512_lime_plus_mark [EXTRACTED 1.00]
- **Two-Color Icon Palette** — public_icon_512_two_color_palette, public_icon_512_dark_green_field, public_icon_512_lime_circle_ring, public_icon_512_lime_plus_mark [INFERRED 0.85]
- **HVPS Sports App Mark** — public_icon_pitch_green_square, public_icon_lime_circle, public_icon_lime_crosshair [EXTRACTED 1.00]

## Communities (32 total, 7 thin omitted)

### Community 0 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, bcryptjs, class-variance-authority, clsx, date-fns, lucide-react, next, next-auth (+21 more)

### Community 1 - "TypeScript Config"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+13 more)

### Community 2 - "App Shell Providers"
Cohesion: 0.14
Nodes (12): geistMono, geistSans, metadata, viewport, QueryProvider(), SessionProviderWrapper(), ThemeProvider(), BeforeInstallPromptEvent (+4 more)

### Community 3 - "Dev Tooling"
Cohesion: 0.11
Nodes (18): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, nodemon, prettier, tailwindcss, @tailwindcss/postcss (+10 more)

### Community 4 - "shadcn Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 5 - "NPM Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:generate, db:push, db:seed, dev, dev:next, format (+5 more)

### Community 6 - "Mobile UI Shell"
Cohesion: 0.24
Nodes (6): actions, BottomNav(), items, Button(), buttonVariants, cn()

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

### Community 15 - "Graphify Always-On"
Cohesion: 0.50
Nodes (4): graphify always-on, HVPS Sports agent instructions, graphify knowledge graph, Obsidian graphify export

### Community 17 - "Product Identity"
Cohesion: 0.67
Nodes (3): jjcriccrm core stack, HVPS Sports, Mobile-first PWA

## Knowledge Gaps
- **124 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `Dev Tooling`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Scripts` to `Dev Tooling`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `App Shell Providers` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._