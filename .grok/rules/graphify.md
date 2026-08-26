# graphify

This project has a knowledge graph at `graphify-out/`.

When the user types `/graphify`, follow the graphify skill before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- Obsidian export lives in `C:\Users\coachJJ\Documents\Obsidian Vault\02 Projects\HVPS Sports Graph`. After a graph rebuild, run `graphify export obsidian --dir "C:\Users\coachJJ\Documents\Obsidian Vault\02 Projects\HVPS Sports Graph"`.
