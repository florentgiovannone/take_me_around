# Root `npm run dev` App Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive multi-select at the monorepo root so `npm run dev` lets developers start one or more apps in parallel, while keeping existing `dev:*` shortcuts.

**Architecture:** Extract pure helpers for app discovery and concurrently command building; cover them with Node's built-in test runner. Wire a thin `scripts/dev.mjs` that prompts with `@inquirer/prompts` checkbox and runs selected workspaces via the `concurrently` package.

**Tech Stack:** Node ESM (`.mjs`), `@inquirer/prompts`, `concurrently`, `node:test` / `node:assert/strict`, npm workspaces.

**Spec:** `docs/superpowers/specs/2026-07-28-dev-app-picker-design.md`

## Global Constraints

- Root script: `"dev": "node scripts/dev.mjs"`
- Keep all existing `dev:gallery`, `dev:museum`, `dev:arkin-museum`, `dev:dashboard`, `dev:church-of-england` scripts unchanged
- Discover apps only from `apps/*/package.json` that define `scripts.dev`
- Multi-select via checkbox (arrows / space / enter)
- Non-TTY: fail fast (exit non-zero), list apps, point at `npm run dev:<shortcut>` where shortcut is folder name with `_` → `-`
- Empty selection / cancel: exit 0, start nothing
- No CLI args for this feature; no Turbo/Nx; no port changes
- Root `devDependencies` only: `@inquirer/prompts`, `concurrently`
- Commit after each task with a concise message

## File structure (locked)

| Path | Responsibility |
|------|----------------|
| `scripts/lib/discoverApps.mjs` | Scan `apps/` and return `{ folder, packageName, shortcut }[]` |
| `scripts/lib/buildConcurrentlyCommands.mjs` | Map selected apps → concurrently command objects |
| `scripts/lib/discoverApps.test.mjs` | Unit tests for discovery |
| `scripts/lib/buildConcurrentlyCommands.test.mjs` | Unit tests for command building |
| `scripts/dev.mjs` | TTY check, prompt, run concurrently |
| Root `package.json` | `"dev"` script + root `devDependencies` |

---

### Task 1: App discovery helper + tests

**Files:**
- Create: `scripts/lib/discoverApps.mjs`
- Create: `scripts/lib/discoverApps.test.mjs`

**Interfaces:**
- Produces:
  - `export function discoverApps(appsDir: string): AppInfo[]`
  - `AppInfo = { folder: string, packageName: string, shortcut: string }`
  - `shortcut` = `folder.replaceAll('_', '-')`
  - Skip entries that are not directories, missing `package.json`, missing `name`, or missing `scripts.dev`
  - Sort by `folder` ascending

- [ ] **Step 1: Write the failing tests**

Create `scripts/lib/discoverApps.test.mjs`:

```js
import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { discoverApps } from "./discoverApps.mjs"

async function writePkg(dir, folder, pkg) {
  const appDir = join(dir, folder)
  await mkdir(appDir, { recursive: true })
  await writeFile(join(appDir, "package.json"), JSON.stringify(pkg, null, 2))
}

test("discoverApps returns apps with a dev script, sorted by folder", async () => {
  const root = await mkdtemp(join(tmpdir(), "tma-discover-"))
  try {
    await writePkg(root, "zebra", {
      name: "@tma/app-zebra",
      scripts: { dev: "vite" },
    })
    await writePkg(root, "alpha", {
      name: "@tma/app-alpha",
      scripts: { dev: "vite" },
    })
    await writePkg(root, "church_of_england", {
      name: "@tma/app-church-of-england",
      scripts: { dev: "vite" },
    })
    await writePkg(root, "no_dev", {
      name: "@tma/app-no-dev",
      scripts: { build: "vite build" },
    })
    await mkdir(join(root, "not_a_package"), { recursive: true })

    const apps = await discoverApps(root)
    assert.deepEqual(apps, [
      {
        folder: "alpha",
        packageName: "@tma/app-alpha",
        shortcut: "alpha",
      },
      {
        folder: "church_of_england",
        packageName: "@tma/app-church-of-england",
        shortcut: "church-of-england",
      },
      {
        folder: "zebra",
        packageName: "@tma/app-zebra",
        shortcut: "zebra",
      },
    ])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("discoverApps returns empty array when no apps qualify", async () => {
  const root = await mkdtemp(join(tmpdir(), "tma-discover-empty-"))
  try {
    await writePkg(root, "only_build", {
      name: "@tma/app-only-build",
      scripts: { build: "vite build" },
    })
    const apps = await discoverApps(root)
    assert.deepEqual(apps, [])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/lib/discoverApps.test.mjs`

Expected: FAIL (module or `discoverApps` not found)

- [ ] **Step 3: Implement `discoverApps`**

Create `scripts/lib/discoverApps.mjs`:

```js
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

/**
 * @typedef {{ folder: string, packageName: string, shortcut: string }} AppInfo
 */

/**
 * @param {string} appsDir
 * @returns {Promise<AppInfo[]>}
 */
export async function discoverApps(appsDir) {
  let entries
  try {
    entries = await readdir(appsDir, { withFileTypes: true })
  } catch {
    return []
  }

  /** @type {AppInfo[]} */
  const apps = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const pkgPath = join(appsDir, entry.name, "package.json")
    let pkg
    try {
      pkg = JSON.parse(await readFile(pkgPath, "utf8"))
    } catch {
      continue
    }

    if (!pkg?.name || !pkg?.scripts?.dev) continue

    apps.push({
      folder: entry.name,
      packageName: pkg.name,
      shortcut: entry.name.replaceAll("_", "-"),
    })
  }

  apps.sort((a, b) => a.folder.localeCompare(b.folder))
  return apps
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/lib/discoverApps.test.mjs`

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/discoverApps.mjs scripts/lib/discoverApps.test.mjs
git commit -m "$(cat <<'EOF'
Add discoverApps helper for root dev picker.

EOF
)"
```

---

### Task 2: Concurrently command builder + tests

**Files:**
- Create: `scripts/lib/buildConcurrentlyCommands.mjs`
- Create: `scripts/lib/buildConcurrentlyCommands.test.mjs`

**Interfaces:**
- Consumes: `AppInfo` shape from Task 1
- Produces:
  - `export function buildConcurrentlyCommands(apps: AppInfo[]): { name: string, command: string, prefixColor: string }[]`
  - `name` = `folder`
  - `command` = `npm run dev -w <packageName>`
  - `prefixColor` cycles through a fixed palette: `blue`, `green`, `magenta`, `cyan`, `yellow`, `red`

- [ ] **Step 1: Write the failing tests**

Create `scripts/lib/buildConcurrentlyCommands.test.mjs`:

```js
import assert from "node:assert/strict"
import { test } from "node:test"
import { buildConcurrentlyCommands } from "./buildConcurrentlyCommands.mjs"

test("buildConcurrentlyCommands maps apps to named npm workspace commands", () => {
  const commands = buildConcurrentlyCommands([
    {
      folder: "gallery",
      packageName: "@tma/app-gallery",
      shortcut: "gallery",
    },
    {
      folder: "church_of_england",
      packageName: "@tma/app-church-of-england",
      shortcut: "church-of-england",
    },
  ])

  assert.deepEqual(commands, [
    {
      name: "gallery",
      command: "npm run dev -w @tma/app-gallery",
      prefixColor: "blue",
    },
    {
      name: "church_of_england",
      command: "npm run dev -w @tma/app-church-of-england",
      prefixColor: "green",
    },
  ])
})

test("buildConcurrentlyCommands cycles prefix colors", () => {
  const apps = Array.from({ length: 7 }, (_, i) => ({
    folder: `app_${i}`,
    packageName: `@tma/app-${i}`,
    shortcut: `app-${i}`,
  }))
  const colors = buildConcurrentlyCommands(apps).map((c) => c.prefixColor)
  assert.deepEqual(colors, [
    "blue",
    "green",
    "magenta",
    "cyan",
    "yellow",
    "red",
    "blue",
  ])
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/lib/buildConcurrentlyCommands.test.mjs`

Expected: FAIL (module not found)

- [ ] **Step 3: Implement builder**

Create `scripts/lib/buildConcurrentlyCommands.mjs`:

```js
const PREFIX_COLORS = ["blue", "green", "magenta", "cyan", "yellow", "red"]

/**
 * @typedef {{ folder: string, packageName: string, shortcut: string }} AppInfo
 */

/**
 * @param {AppInfo[]} apps
 * @returns {{ name: string, command: string, prefixColor: string }[]}
 */
export function buildConcurrentlyCommands(apps) {
  return apps.map((app, index) => ({
    name: app.folder,
    command: `npm run dev -w ${app.packageName}`,
    prefixColor: PREFIX_COLORS[index % PREFIX_COLORS.length],
  }))
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/lib/buildConcurrentlyCommands.test.mjs scripts/lib/discoverApps.test.mjs`

Expected: PASS (all tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/buildConcurrentlyCommands.mjs scripts/lib/buildConcurrentlyCommands.test.mjs
git commit -m "$(cat <<'EOF'
Add concurrently command builder for root dev picker.

EOF
)"
```

---

### Task 3: Wire `scripts/dev.mjs`, root deps, and `npm run dev`

**Files:**
- Create: `scripts/dev.mjs`
- Modify: `package.json` (root)
- Modify: `package-lock.json` (via npm install)

**Interfaces:**
- Consumes: `discoverApps`, `buildConcurrentlyCommands`
- Produces: root `"dev"` script that prompts and runs selected apps

- [ ] **Step 1: Install root dependencies**

From repo root:

```bash
npm install -D @inquirer/prompts concurrently
```

Expected: both packages appear under root `devDependencies` in `package.json`; lockfile updated.

- [ ] **Step 2: Add root `dev` script**

In root `package.json`, add to `"scripts"` (keep existing `dev:*` and `build*` entries):

```json
"dev": "node scripts/dev.mjs"
```

Full scripts object should still include:

```json
"dev:gallery": "npm run dev -w @tma/app-gallery",
"dev:museum": "npm run dev -w @tma/app-museum",
"dev:arkin-museum": "npm run dev -w @tma/app-arkin-museum",
"dev:dashboard": "npm run dev -w @tma/app-dashboard",
"dev:church-of-england": "npm run dev -w @tma/app-church-of-england"
```

- [ ] **Step 3: Implement `scripts/dev.mjs`**

Create `scripts/dev.mjs`:

```js
import { checkbox } from "@inquirer/prompts"
import concurrently from "concurrently"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { discoverApps } from "./lib/discoverApps.mjs"
import { buildConcurrentlyCommands } from "./lib/buildConcurrentlyCommands.mjs"

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..")
const appsDir = join(rootDir, "apps")

const apps = await discoverApps(appsDir)

if (apps.length === 0) {
  console.error("No apps with a dev script found under apps/.")
  process.exit(1)
}

if (!process.stdin.isTTY) {
  console.error("Interactive terminal required for npm run dev.")
  console.error("Use a per-app shortcut instead:")
  for (const app of apps) {
    console.error(`  npm run dev:${app.shortcut}`)
  }
  process.exit(1)
}

let selected
try {
  selected = await checkbox({
    message: "Which app(s) do you want to run?",
    choices: apps.map((app) => ({
      name: `${app.folder} (${app.packageName})`,
      value: app.folder,
    })),
    required: false,
  })
} catch {
  // User cancelled (Ctrl+C during prompt)
  process.exit(0)
}

if (!selected.length) {
  console.log("No apps selected.")
  process.exit(0)
}

const selectedApps = apps.filter((app) => selected.includes(app.folder))
const commands = buildConcurrentlyCommands(selectedApps)

const { result } = concurrently(commands, {
  prefixColors: true,
  killOthersOn: ["failure"],
})

try {
  await result
} catch {
  process.exit(1)
}
```

- [ ] **Step 4: Verify discovery against the real repo**

Run: `node --test scripts/lib/*.test.mjs`

Expected: PASS

Then smoke-check discovery on real apps:

```bash
node -e "import { discoverApps } from './scripts/lib/discoverApps.mjs'; const apps = await discoverApps(new URL('./apps', import.meta.url).pathname); console.log(apps.map(a => a.folder).join(','))"
```

Expected: includes `arkin_museum,church_of_england,dashboard,gallery,museum` (order may vary but sort is alphabetical: `arkin_museum,church_of_england,dashboard,gallery,museum`)

- [ ] **Step 5: Manual interactive smoke (human or local TTY)**

Run: `npm run dev`

Expected:
1. Checkbox listing all five apps
2. Selecting one app starts that Vite (or dashboard) process with a name prefix
3. Selecting two apps starts both with distinct prefixes
4. Ctrl+C stops them
5. `npm run dev:gallery` still starts gallery without the picker

Non-TTY check:

```bash
npm run dev </dev/null
```

Expected: exit non-zero; message lists `npm run dev:gallery`, `npm run dev:museum`, etc.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json scripts/dev.mjs
git commit -m "$(cat <<'EOF'
Add interactive root npm run dev app picker.

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Interactive multi-select | Task 3 |
| One or many apps in parallel | Task 2 + 3 |
| Keep existing `dev:*` | Task 3 (preserve scripts) |
| Auto-discover `apps/*/package.json` with `dev` | Task 1 |
| `concurrently` labeled logs | Task 2 + 3 |
| Non-TTY fail-fast with shortcuts | Task 3 |
| Empty/cancel exits without starting | Task 3 |
| No apps → exit 1 | Task 3 |
| Root deps `@inquirer/prompts`, `concurrently` | Task 3 |

## Self-review notes

- No placeholders; helpers and `dev.mjs` are fully specified
- `AppInfo` fields stay consistent across Tasks 1–3
- Shortcut mapping `_` → `-` matches existing root script names (`arkin-museum`, `church-of-england`)
- Out-of-scope items (CLI args, ports, Turbo) intentionally omitted
