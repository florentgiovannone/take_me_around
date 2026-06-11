#!/usr/bin/env node
/**
 * Export ElevenLabs narration scripts for each exhibition artwork.
 * Usage: node scripts/export-audio-scripts.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { readFileSync } from "node:fs"
import { buildAudioScript } from "./lib/audio-script.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, "../src/data/rodinArtworks.ts")
const source = readFileSync(dataPath, "utf8")

function parseArtworks(ts) {
  const artworks = []
  const blocks = ts.split(/\n  \},\n/).map((b, i, arr) => (i < arr.length - 1 ? b + "\n  }," : b))

  for (const block of blocks) {
    const slug = block.match(/slug: "([^"]+)"/)?.[1]
    if (!slug || !block.includes("exhibitionStyle: true")) continue

    const title = block.match(/title: "([^"]+)"/)?.[1]
    const subtitle = block.match(/subtitle: "([^"]+)"/)?.[1]
    const artist = block.match(/artist: "([^"]+)"/)?.[1]
    const summaryMatch = block.match(/summary:\s*(?:\n\s*)?"((?:\\.|[^"\\])*)"/)
    const summary = summaryMatch
      ? summaryMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\'/g, "'")
      : undefined
    const aboutMatch = block.match(/aboutParagraphs: \[([\s\S]*?)\n    \],/)
    const paragraphs = []
    if (aboutMatch) {
      for (const m of aboutMatch[1].matchAll(/"((?:\\.|[^"\\])*)"/g)) {
        paragraphs.push(
          m[1]
            .replace(/\\"/g, '"')
            .replace(/\\n/g, "\n")
            .replace(/\\'/g, "'"),
        )
      }
    }

    artworks.push({ slug, title, subtitle, artist, summary, aboutParagraphs: paragraphs })
  }

  return artworks
}

const artworks = parseArtworks(source)
const outDir = join(__dirname, "rodin-audio-scripts")
const jsonPath = join(__dirname, "rodin-audio-scripts.json")
const scripts = {}

mkdirSync(outDir, { recursive: true })

for (const artwork of artworks) {
  const script = buildAudioScript(artwork)
  scripts[artwork.slug] = script
  writeFileSync(join(outDir, `${artwork.slug}.txt`), `${script}\n`)
  console.log(`${artwork.slug}: ${script.length} chars`)
}

writeFileSync(jsonPath, JSON.stringify(scripts, null, 2))
console.log(`\nWrote ${artworks.length} scripts to ${outDir}/ and ${jsonPath}`)
