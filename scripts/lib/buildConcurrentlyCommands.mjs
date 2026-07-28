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
