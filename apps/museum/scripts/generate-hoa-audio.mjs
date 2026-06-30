#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const extra = process.argv.slice(2)
spawnSync("node", ["scripts/generate-artwork-audio.mjs", "--artwork", "hoa-hakananai", ...extra], {
  cwd: root,
  stdio: "inherit",
})
