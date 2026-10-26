import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..")
const churchRoot = join(appRoot, "../church_of_england")
const arkinRoot = join(appRoot, "../arkin_museum")

/** Load .env.local into process.env (does not override existing env vars). */
export function loadEnvLocal() {
  for (const root of [appRoot, churchRoot, arkinRoot]) {
    const path = join(root, ".env.local")
    if (!existsSync(path)) continue

    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!value) continue
      if (key === "ELEVENLABS_API_KEY" && process.env[key] && !process.env[key].startsWith("sk_") && value.startsWith("sk_")) {
        process.env[key] = value
        continue
      }
      if (!(key in process.env)) process.env[key] = value
    }
  }
}
