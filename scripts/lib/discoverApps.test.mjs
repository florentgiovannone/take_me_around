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
