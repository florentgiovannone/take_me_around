# Root `npm run dev` app picker — design

**Date:** 2026-07-28  
**Status:** Approved for planning  
**Approach:** Interactive multi-select via `@inquirer/prompts` + `concurrently`

## Goal

When running `npm run dev` at the TMA_frontend monorepo root, present an interactive terminal picker so the developer can choose one or more apps under `apps/` to start in parallel. Existing per-app shortcuts (`dev:gallery`, `dev:museum`, etc.) remain unchanged.

## Decisions

| Topic | Choice |
|-------|--------|
| Selection mode | Multi-select (one or many apps) |
| UX | Interactive terminal menu (arrows / space / enter) |
| Existing `dev:*` scripts | Keep as direct non-interactive shortcuts |
| Discovery | Auto-discover from `apps/*/package.json` that define a `dev` script |
| Runner | `concurrently` with named, color-prefixed logs |
| Non-TTY | Fail fast with a message pointing to `dev:<name>` scripts |

## Out of scope

- CLI args such as `npm run dev -- gallery dashboard`
- Changing Vite ports or `--open` behavior
- A build picker (`npm run build` stays as today)
- Adopting Turbo/Nx for this feature
- Large README rewrites (at most a one-line mention if needed)

## Architecture

```
package.json                 # "dev": "node scripts/dev.mjs"; root deps
scripts/dev.mjs              # discover apps → prompt → concurrently
apps/*/package.json          # source of truth for name + "dev" script
```

### Flow

1. `npm run dev` runs `node scripts/dev.mjs`.
2. Script scans `apps/*` for directories with a `package.json` that has `scripts.dev`.
3. Each choice is labeled with the folder name (e.g. `church_of_england`); package name (e.g. `@tma/app-church-of-england`) may appear as a hint.
4. If stdin is not a TTY: print available apps and instruct the user to use `npm run dev:<name>`; exit non-zero.
5. If no apps found: print a clear error; exit 1.
6. Prompt with `@inquirer/prompts` checkbox (multi-select). Empty selection or cancel exits without starting anything.
7. Spawn selected apps via `concurrently`, each as `npm run dev -w <packageName>`, with prefixes matching the folder name.
8. Ctrl+C stops all selected processes.

## Dependencies

Root `devDependencies`:

- `@inquirer/prompts` — interactive multi-select
- `concurrently` — parallel processes with labeled output

No changes to individual app `package.json` scripts are required.

## Edge cases

| Case | Behavior |
|------|----------|
| No apps with `dev` | Error message, exit 1 |
| Empty selection / cancel | Exit 0, start nothing |
| Single app selected | Still run through the same runner path |
| Multiple Vite `--open` | May open multiple browser tabs; accepted as-is |
| New app added under `apps/` | Appears automatically if it has a `dev` script |

## Success criteria

- `npm run dev` at root shows an interactive multi-select of current apps.
- Selecting one or more apps starts their existing workspace `dev` scripts with distinguishable log prefixes.
- `npm run dev:gallery` (and siblings) still work unchanged.
- Non-interactive environments do not hang on a prompt.
