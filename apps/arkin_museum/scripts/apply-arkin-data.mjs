#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, "../src/data/rodinArtworks.ts")
const SCRAPE_FILE = join(__dirname, "arkin_scrape.json")

const scrape = JSON.parse(readFileSync(SCRAPE_FILE, "utf8"))

scrape.danaide = {
  slug: "danaide",
  url: "https://www.thearkinrodincollection.com/",
  caption: "Conceived in 1885, cast circa 1925.",
  meta: {
    height: "21 cm",
    marksAndInscriptions:
      "Signed A. Rodin with repeat raised interior signature. Inscribed © Alexis Rudier Fondeur Paris.",
    inventoryNumber: "RCG0013.2-13",
    materials: "Bronze with a rich dark and red/brown patination",
    location: "The Arkın Clock Tower - Arkın Group Headquarters",
  },
}

function tsString(value) {
  return JSON.stringify(value)
}

function formatMeta(meta) {
  const lines = ["    meta: {"]
  for (const key of [
    "height",
    "marksAndInscriptions",
    "inventoryNumber",
    "materials",
    "location",
  ]) {
    if (meta[key]) lines.push(`      ${key}: ${tsString(meta[key])},`)
  }
  lines.push("    },")
  return lines.join("\n")
}

function upsertArkinSource(sourcesInner, url, title) {
  const arkinLine = `      { label: ${tsString(`Arkın Rodin Collection — ${title}`)}, href: ${tsString(url)} },`
  const lines = sourcesInner.split("\n").filter((l) => !l.includes("Arkın Rodin Collection"))
  return [arkinLine, ...lines.filter((l) => l.trim())].join("\n")
}

let content = readFileSync(DATA_FILE, "utf8")
const headerEnd = content.indexOf("export const RODIN_ARTWORKS")
const arrayStart = content.indexOf("[", headerEnd)
const arrayEnd = content.lastIndexOf("]\n")
const prefix = content.slice(0, arrayStart + 1)
const suffix = content.slice(arrayEnd)
const arrayBody = content.slice(arrayStart + 1, arrayEnd)

const blocks = arrayBody.split(/\n  \},\n/).map((b, i, arr) => {
  if (i < arr.length - 1) return b + "\n  },"
  return b
})

let updated = 0
const newBlocks = blocks.map((block) => {
  const slugMatch = block.match(/slug: "([^"]+)"/)
  if (!slugMatch) return block
  const slug = slugMatch[1]
  const data = scrape[slug]
  if (!data?.caption && !Object.keys(data?.meta || {}).length) return block

  let next = block

  if (data.caption) {
    if (/caption:/.test(next)) {
      next = next.replace(/caption: [^\n]+/, `caption: ${tsString(data.caption)},`)
    } else {
      next = next.replace(
        /(exhibitionStyle: true,)\n/,
        `$1\n    caption: ${tsString(data.caption)},\n`,
      )
    }
  }

  if (data.meta && Object.keys(data.meta).length) {
    next = next.replace(/meta: \{[\s\S]*?\n    \},/, formatMeta(data.meta))
  }

  if (data.url && /sources: \[/.test(next)) {
    const titleMatch = next.match(/title: ([^\n]+)/)
    const title = titleMatch ? JSON.parse(titleMatch[1].replace(/,$/, "")) : slug
    next = next.replace(/sources: \[([\s\S]*?)\],/, (_, inner) => {
      return `sources: [\n${upsertArkinSource(inner, data.url, title)}\n    ],`
    })
  }

  updated++
  return next
})

writeFileSync(DATA_FILE, prefix + newBlocks.join("\n") + suffix)
console.log(`Updated ${updated} artworks in ${DATA_FILE}`)
