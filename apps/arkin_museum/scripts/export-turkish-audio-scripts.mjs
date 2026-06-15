#!/usr/bin/env node
/**
 * Export Turkish ElevenLabs narration scripts from rodinArtworks.tr.ts.
 *
 * Usage:
 *   node scripts/export-turkish-audio-scripts.mjs
 *   node scripts/export-turkish-audio-scripts.mjs --slug the-secret
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { buildTurkishAudioScript } from "./lib/audio-script.mjs"
import { parseExhibitionArtworks } from "./lib/parse-rodin-artworks.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, "../src/data/rodinArtworks.ts")
const trPath = join(__dirname, "../src/data/rodinArtworks.tr.ts")
const outDir = join(__dirname, "rodin-audio-scripts")
const jsonPath = join(__dirname, "rodin-audio-scripts-tr.json")

const args = process.argv.slice(2)
const onlySlug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null

function loadTurkishLocales(path) {
  const source = readFileSync(path, "utf8")
  const match = source.match(/export const RODIN_ARTWORK_LOCALES_TR[^=]*=\s*(\{[\s\S]*\})\s*;?\s*$/)
  if (!match) {
    throw new Error(`Could not parse Turkish locales from ${path}`)
  }
  return JSON.parse(match[1])
}

const artworks = parseExhibitionArtworks(readFileSync(dataPath, "utf8"))
const artworkBySlug = Object.fromEntries(artworks.map((a) => [a.slug, a]))
const localesTr = loadTurkishLocales(trPath)

mkdirSync(outDir, { recursive: true })

const scripts = {}
let count = 0

for (const [slug, tr] of Object.entries(localesTr)) {
  if (onlySlug && slug !== onlySlug) continue

  const artwork = artworkBySlug[slug]
  if (!artwork) {
    console.warn(`skip ${slug} (no English artwork entry)`)
    continue
  }

  const script = buildTurkishAudioScript(artwork, tr)
  scripts[slug] = script
  writeFileSync(join(outDir, `${slug}.tr.txt`), `${script}\n`)
  console.log(`${slug}.tr.txt: ${script.length} chars`)
  count++
}

writeFileSync(jsonPath, JSON.stringify(scripts, null, 2))
console.log(`\nWrote ${count} Turkish scripts to ${outDir}/ and ${jsonPath}`)
