#!/usr/bin/env node
/**
 * Translate essay artwork copy (Dendur / Kiss) via DeepL.
 *
 * Usage:
 *   node scripts/translate-essay-artwork.mjs --artwork the-temple-of-dendur
 *   node scripts/translate-essay-artwork.mjs --artwork the-kiss --lang de
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { ARTWORK_LOCALE_TARGETS } from "./artwork-locales.config.mjs"
import { countCharacters, getDeepLUsage, translateTexts } from "./lib/deepl.mjs"
import { loadEnvLocal } from "./lib/load-env.mjs"

loadEnvLocal()

const __dirname = dirname(fileURLToPath(import.meta.url))
const museumRoot = join(__dirname, "..")
const galleryRoot = join(museumRoot, "../gallery")

const ESSAY_ARTWORKS = {
  "the-temple-of-dendur": {
    app: "museum",
    dataBase: "templeOfDendur",
    exportPrefix: "TEMPLE_OF_DENDUR",
    copyTypeName: "TempleOfDendurCopy",
  },
  "the-kiss": {
    app: "gallery",
    dataBase: "theKiss",
    exportPrefix: "THE_KISS",
    copyTypeName: "TheKissCopy",
  },
}

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const artworkSlug = args.includes("--artwork") ? args[args.indexOf("--artwork") + 1] : null
const onlyLang = args.includes("--lang") ? args[args.indexOf("--lang") + 1] : null
const onlyLangs = args.includes("--langs") ? args[args.indexOf("--langs") + 1] : null

const apiKey = process.env.DEEPL_API_KEY
const apiUrl = process.env.DEEPL_API_URL ?? "https://api-free.deepl.com"

const artwork = artworkSlug ? ESSAY_ARTWORKS[artworkSlug] : null
if (!artwork) {
  console.error(`Pass --artwork ${Object.keys(ESSAY_ARTWORKS).join(" | ")}`)
  process.exit(1)
}

const appRoot = artwork.app === "gallery" ? galleryRoot : museumRoot
const sourcePath = join(appRoot, "src/data", `${artwork.dataBase}.en.json`)

const TARGETS = ARTWORK_LOCALE_TARGETS.map((entry) => ({
  code: entry.deepl,
  locale: entry.locale,
  exportName: `${artwork.exportPrefix}_${entry.locale.toUpperCase()}`,
  fileName: `${artwork.dataBase}.${entry.locale}.ts`,
  label: entry.label,
}))

function flattenCopy(source) {
  const jobs = []
  const keys = []
  const push = (key, value) => {
    if (value == null || value === "") return
    keys.push(key)
    jobs.push(value)
  }

  for (const field of [
    "banner",
    "eyebrow",
    "title",
    "titleEm",
    "subtitle",
    "imageAlt",
    "figcaption",
    "credit",
    "lede",
    "colophonLeft",
    "colophonRight",
  ]) {
    push(field, source[field])
  }

  ;(source.eyebrowParts ?? []).forEach((part, i) => push(`eyebrowParts:${i}`, part))

  ;(source.facts ?? []).forEach((fact, i) => {
    push(`fact:${i}:k`, fact.k)
    push(`fact:${i}:v`, fact.v)
  })

  for (const section of source.sections ?? []) {
    const id = section.id
    push(`section:${id}:heading`, section.heading)
    ;(section.paragraphs ?? []).forEach((p, j) => push(`section:${id}:p:${j}`, p))
    ;(section.motifs ?? []).forEach((motif, k) => {
      push(`section:${id}:motif:${k}:label`, motif.label)
      push(`section:${id}:motif:${k}:text`, motif.text)
    })
    push(`section:${id}:afterNote`, section.afterNote)
    push(`section:${id}:quote`, section.quote)
    push(`section:${id}:quoteCite`, section.quoteCite)
    push(`section:${id}:visitLabel`, section.visitLabel)
    push(`section:${id}:visitBody`, section.visitBody)
  }

  return { jobs, keys }
}

function rebuildCopy(source, keys, translated) {
  const map = Object.fromEntries(keys.map((key, index) => [key, translated[index]]))
  const next = {
    ...source,
    banner: map.banner ?? source.banner,
    title: map.title ?? source.title,
    subtitle: map.subtitle ?? source.subtitle,
    imageAlt: map.imageAlt ?? source.imageAlt,
    figcaption: map.figcaption ?? source.figcaption,
    credit: map.credit ?? source.credit,
    lede: map.lede ?? source.lede,
    colophonLeft: map.colophonLeft ?? source.colophonLeft,
    colophonRight: map.colophonRight ?? source.colophonRight,
  }

  if (source.eyebrow != null) next.eyebrow = map.eyebrow ?? source.eyebrow
  if (source.titleEm != null) next.titleEm = map.titleEm ?? source.titleEm

  if (source.eyebrowParts) {
    next.eyebrowParts = source.eyebrowParts.map(
      (part, i) => map[`eyebrowParts:${i}`] ?? part,
    )
  }

  next.facts = (source.facts ?? []).map((fact, i) => ({
    k: map[`fact:${i}:k`] ?? fact.k,
    v: map[`fact:${i}:v`] ?? fact.v,
  }))

  next.sections = (source.sections ?? []).map((section) => {
    const id = section.id
    const rebuilt = {
      id,
      heading: map[`section:${id}:heading`] ?? section.heading,
      paragraphs: (section.paragraphs ?? []).map(
        (p, j) => map[`section:${id}:p:${j}`] ?? p,
      ),
    }
    if (section.motifs) {
      rebuilt.motifs = section.motifs.map((motif, k) => ({
        label: map[`section:${id}:motif:${k}:label`] ?? motif.label,
        text: map[`section:${id}:motif:${k}:text`] ?? motif.text,
      }))
    }
    for (const field of ["afterNote", "quote", "quoteCite", "visitLabel", "visitBody"]) {
      if (section[field] != null) {
        rebuilt[field] = map[`section:${id}:${field}`] ?? section[field]
      }
    }
    return rebuilt
  })

  return next
}

function toTsFile(exportName, copyTypeName, dataBase, copy, langLabel) {
  return `import type { ${copyTypeName} } from "./${dataBase}"

/** ${langLabel} copy — generated by scripts/translate-essay-artwork.mjs (review before publishing). */
export const ${exportName}: ${copyTypeName} = ${JSON.stringify(copy, null, 2)}
`
}

function filterTargets() {
  if (onlyLangs) {
    const wanted = new Set(onlyLangs.split(",").map((value) => value.trim().toLowerCase()))
    return TARGETS.filter(
      (target) => wanted.has(target.locale) || wanted.has(target.code.toLowerCase()),
    )
  }
  if (onlyLang) {
    const wanted = onlyLang.trim().toLowerCase()
    return TARGETS.filter(
      (target) => target.locale === wanted || target.code.toLowerCase() === wanted,
    )
  }
  return TARGETS
}

if (!dryRun && !apiKey) {
  console.error("Set DEEPL_API_KEY in apps/museum/.env.local or apps/arkin_museum/.env.local")
  process.exit(1)
}

const source = JSON.parse(readFileSync(sourcePath, "utf8"))
const { jobs, keys } = flattenCopy(source)
const targets = filterTargets()

if (targets.length === 0) {
  console.error(`Unknown language filter; use --lang de or --langs ar,de,es`)
  process.exit(1)
}

console.log(
  `Translating ${artworkSlug}, ~${countCharacters(jobs)} characters → ${targets.map((t) => t.code).join(", ")}`,
)

if (dryRun) process.exit(0)

try {
  const usage = await getDeepLUsage(apiKey, apiUrl)
  console.log(
    `DeepL usage: ${usage.character_count} / ${usage.character_limit} characters this billing period`,
  )
} catch (error) {
  console.warn(`Could not fetch usage: ${error.message}`)
}

for (const target of targets) {
  console.log(`translate → ${target.code}...`)
  const translated = await translateTexts(jobs, {
    apiKey,
    apiUrl,
    targetLang: target.code,
  })
  const copy = rebuildCopy(source, keys, translated)
  const contents = toTsFile(
    target.exportName,
    artwork.copyTypeName,
    artwork.dataBase,
    copy,
    target.label,
  )
  const outPath = join(appRoot, "src/data", target.fileName)
  writeFileSync(outPath, contents)
  console.log(`  wrote ${outPath}`)
  await new Promise((r) => setTimeout(r, 300))
}

console.log("\nReview translated copy, then wire locale resolvers if needed.")
