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
