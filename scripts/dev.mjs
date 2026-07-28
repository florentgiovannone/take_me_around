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
    message: "Which app(s) do you want to run? (space to select, enter to confirm)",
    choices: apps.map((app) => ({
      name: `${app.folder} (${app.packageName})`,
      value: app.folder,
    })),
    required: true,
  })
} catch {
  // User cancelled (Ctrl+C during prompt)
  process.exit(0)
}

const selectedApps = apps.filter((app) => selected.includes(app.folder))
const commands = buildConcurrentlyCommands(selectedApps)

const { result } = concurrently(commands, {
  killOthersOn: ["failure"],
})

try {
  await result
} catch {
  process.exit(1)
}
