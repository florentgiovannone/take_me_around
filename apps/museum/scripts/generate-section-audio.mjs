#!/usr/bin/env node
/**
 * Generate per-section MP3s for essay stops (Dendur / Kiss) via DeepL + ElevenLabs.
 *
 * Usage:
 *   node scripts/generate-section-audio.mjs --work the-temple-of-dendur
 *   node scripts/generate-section-audio.mjs --work the-kiss --locale fr
 *   node scripts/generate-section-audio.mjs --work the-kiss --locales fr,de --force
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import { ARTWORK_LOCALE_TARGETS } from "./artwork-locales.config.mjs"
import { ELEVENLABS_DEFAULTS } from "./elevenlabs.config.mjs"
import { SECTION_AUDIO_WORKS } from "./section-audio.config.mjs"
import { translateTexts } from "./lib/deepl.mjs"
import { loadEnvLocal } from "./lib/load-env.mjs"

loadEnvLocal()

const __dirname = dirname(fileURLToPath(import.meta.url))
const museumRoot = join(__dirname, "..")
const galleryRoot = join(museumRoot, "../gallery")
const speechCacheDir = join(__dirname, "section-audio")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const force = args.includes("--force")
const onlyWork = args.includes("--work") ? args[args.indexOf("--work") + 1] : null
const onlySection = args.includes("--section") ? args[args.indexOf("--section") + 1] : null
const onlyLocale = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : null
const onlyLocales = args.includes("--locales") ? args[args.indexOf("--locales") + 1] : null
const skipEn = args.includes("--skip-en")

const apiKey = process.env.ELEVENLABS_API_KEY
const deeplKey = process.env.DEEPL_API_KEY
const apiUrl = process.env.DEEPL_API_URL ?? "https://api-free.deepl.com"
const modelId = process.env.ELEVENLABS_MODEL_ID ?? ELEVENLABS_DEFAULTS.modelId
const enVoiceId = process.env.ELEVENLABS_VOICE_ID

if (!onlyWork || !SECTION_AUDIO_WORKS[onlyWork]) {
  console.error(`Pass --work ${Object.keys(SECTION_AUDIO_WORKS).join(" | ")}`)
  process.exit(1)
}

const work = SECTION_AUDIO_WORKS[onlyWork]
const appRoot = work.app === "gallery" ? galleryRoot : museumRoot
const audioRoot = join(appRoot, "src/assets", work.assetsDir, "audio")

function localeTargets() {
  const all = [
    {
      locale: "en",
      deepl: null,
      label: "English",
      voiceId: enVoiceId,
      languageCode: "en",
    },
    ...ARTWORK_LOCALE_TARGETS.map((entry) => ({
      locale: entry.locale,
      deepl: entry.deepl,
      label: entry.label,
      voiceId:
        process.env[entry.envVoiceKey] ??
        entry.voiceId ??
        (entry.locale === "tr" ? enVoiceId : undefined),
      languageCode: entry.languageCode,
    })),
  ]

  if (onlyLocales) {
    const wanted = new Set(onlyLocales.split(",").map((v) => v.trim().toLowerCase()))
    return all.filter((t) => wanted.has(t.locale))
  }
  if (onlyLocale) return all.filter((t) => t.locale === onlyLocale.toLowerCase())
  if (skipEn) return all.filter((t) => t.locale !== "en")
  return all
}

async function synthesize({ speechText, voiceId, languageCode }) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: speechText,
      model_id: modelId,
      language_code: languageCode,
      apply_text_normalization: "auto",
    }),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`ElevenLabs failed: ${response.status} ${detail}`)
  }
  if (!response.body) throw new Error("ElevenLabs returned empty body")
  return Readable.fromWeb(response.body)
}

async function getLocalizedSections(localeTarget) {
  if (localeTarget.locale === "en") return work.sections

  mkdirSync(speechCacheDir, { recursive: true })
  const cachePath = join(speechCacheDir, `${onlyWork}.${localeTarget.locale}.json`)
  if (existsSync(cachePath) && !force) {
    return JSON.parse(readFileSync(cachePath, "utf8"))
  }

  if (!deeplKey) throw new Error("Set DEEPL_API_KEY to translate section speech")

  const titles = work.sections.map((s) => s.title)
  const speeches = work.sections.map((s) => s.speechText)
  const translatedTitles = await translateTexts(titles, {
    apiKey: deeplKey,
    apiUrl,
    targetLang: localeTarget.deepl,
  })
  const translatedSpeeches = await translateTexts(speeches, {
    apiKey: deeplKey,
    apiUrl,
    targetLang: localeTarget.deepl,
  })

  const localized = work.sections.map((section, i) => ({
    id: section.id,
    title: translatedTitles[i],
    speechText: translatedSpeeches[i],
  }))
  writeFileSync(cachePath, JSON.stringify(localized, null, 2))
  return localized
}

if (!dryRun && !apiKey) {
  console.error("Set ELEVENLABS_API_KEY in apps/museum/.env.local or apps/arkin_museum/.env.local")
  process.exit(1)
}

const targets = localeTargets()
let generated = 0
let skipped = 0

for (const localeTarget of targets) {
  if (!localeTarget.voiceId) {
    console.error(`missing voice for ${localeTarget.locale}`)
    continue
  }

  const sections = await getLocalizedSections(localeTarget)

  for (const section of sections) {
    if (onlySection && section.id !== onlySection) continue

    const spokenText =
      section.id === "intro" ? section.speechText : `${section.title}. ${section.speechText}`
    const outDir = join(audioRoot, localeTarget.locale, onlyWork)
    const outPath = join(outDir, `${section.id}.mp3`)
    const label = `${localeTarget.locale}/${onlyWork}/${section.id}`

    if (existsSync(outPath) && !force) {
      console.log(`skip ${label}`)
      skipped += 1
      continue
    }

    console.log(
      `${dryRun ? "dry-run" : "generate"} ${label}: ${spokenText.length} chars (${localeTarget.label})`,
    )
    if (dryRun) continue

    mkdirSync(outDir, { recursive: true })
    const stream = await synthesize({
      speechText: spokenText,
      voiceId: localeTarget.voiceId,
      languageCode: localeTarget.languageCode,
    })
    await pipeline(stream, createWriteStream(outPath))
    generated += 1
    await new Promise((r) => setTimeout(r, 200))
  }
}

console.log(`Done. generated=${generated} skipped=${skipped}`)
