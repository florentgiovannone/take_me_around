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
