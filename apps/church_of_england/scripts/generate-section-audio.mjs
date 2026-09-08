#!/usr/bin/env node
/**
 * Generate per-section MP3s for CoE exhibit pages via ElevenLabs.
 *
 * Usage:
 *   node scripts/generate-section-audio.mjs
 *   node scripts/generate-section-audio.mjs --work southwell-minster
 *   node scripts/generate-section-audio.mjs --work southwell-minster --skip-en
 *   node scripts/generate-section-audio.mjs --work southwell-minster --locale fr
 *   node scripts/generate-section-audio.mjs --work westminster-abbey --section history
 *   node scripts/generate-section-audio.mjs --dry-run
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import { ARTWORK_LOCALE_TARGETS } from "./artwork-locales.config.mjs"
import { SECTION_AUDIO_WORKS } from "./section-audio.config.mjs"
import { translateTexts } from "./lib/deepl.mjs"
import { loadEnvLocal } from "./lib/load-env.mjs"

loadEnvLocal()

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = join(__dirname, "..")
const audioRoot = join(appRoot, "src/assets/church-of-england/audio")
const speechCacheDir = join(__dirname, "section-audio")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const force = args.includes("--force")
const skipEn = args.includes("--skip-en")
const onlyWork = args.includes("--work") ? args[args.indexOf("--work") + 1] : null
const onlySection = args.includes("--section")
  ? args[args.indexOf("--section") + 1]
  : null
const onlyLocale = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : null
const onlyLocales = args.includes("--locales") ? args[args.indexOf("--locales") + 1] : null

const apiKey = process.env.ELEVENLABS_API_KEY
const deeplKey = process.env.DEEPL_API_KEY
const apiUrl = process.env.DEEPL_API_URL ?? "https://api-free.deepl.com"
const enVoiceId = process.env.ELEVENLABS_VOICE_ID
const modelId = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2"

if (onlyWork && !SECTION_AUDIO_WORKS[onlyWork]) {
  console.error(`Unknown work "${onlyWork}". Options: ${Object.keys(SECTION_AUDIO_WORKS).join(", ")}`)
  process.exit(1)
}

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
  // Default: English only, matching the original CoE generator.
  return all.filter((t) => t.locale === "en")
}

function resolveEnglishSectionVoiceId(section) {
  if (section.envVoiceKey) {
    const fromEnv = process.env[section.envVoiceKey]
    if (fromEnv) return { voiceId: fromEnv, source: section.envVoiceKey }
    if (section.voiceId) return { voiceId: section.voiceId, source: "config fallback" }
    return { voiceId: null, source: section.envVoiceKey }
  }
  if (section.voiceId) return { voiceId: section.voiceId, source: "config" }
  if (enVoiceId) return { voiceId: enVoiceId, source: "ELEVENLABS_VOICE_ID" }
  return { voiceId: null, source: "ELEVENLABS_VOICE_ID" }
}

async function synthesize({ speechText, voiceId, languageCode }) {
  if (!voiceId) {
    throw new Error("Missing voice id")
  }

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

async function getLocalizedSections(workSlug, work, localeTarget) {
  if (localeTarget.locale === "en") return work.sections

  mkdirSync(speechCacheDir, { recursive: true })
  const cachePath = join(speechCacheDir, `${workSlug}.${localeTarget.locale}.json`)
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
  console.error("Set ELEVENLABS_API_KEY in apps/church_of_england/.env.local or apps/arkin_museum/.env.local")
  process.exit(1)
}

const works = onlyWork
  ? { [onlyWork]: SECTION_AUDIO_WORKS[onlyWork] }
  : SECTION_AUDIO_WORKS

const targets = localeTargets()
if (targets.length === 0) {
  console.error("No locale targets. Use --locale fr, --locales fr,de, or --skip-en")
  process.exit(1)
}

let generated = 0
let skipped = 0

for (const [workSlug, work] of Object.entries(works)) {
  for (const localeTarget of targets) {
    if (localeTarget.locale !== "en" && !localeTarget.voiceId) {
      console.error(`missing voice for ${localeTarget.locale}`)
      continue
    }

    const sections = await getLocalizedSections(workSlug, work, localeTarget)

    for (const section of sections) {
      if (onlySection && section.id !== onlySection) continue

      const spokenText =
        section.id === "intro" ? section.speechText : `${section.title}. ${section.speechText}`
      const outDir = join(audioRoot, localeTarget.locale, workSlug)
      const outPath = join(outDir, `${section.id}.mp3`)
      const label = `${localeTarget.locale}/${workSlug}/${section.id}`

      if (existsSync(outPath) && !force) {
        console.log(`skip ${label} (exists; use --force to overwrite)`)
        skipped += 1
        continue
      }

      const resolved =
        localeTarget.locale === "en"
          ? resolveEnglishSectionVoiceId(work.sections.find((s) => s.id === section.id) ?? section)
          : { voiceId: localeTarget.voiceId, source: localeTarget.locale }

      console.log(
        `${dryRun ? "dry-run" : "generate"} ${label}: ${spokenText.length} chars — ${section.title}` +
          (resolved.voiceId ? ` (voice ${resolved.voiceId} via ${resolved.source})` : ""),
      )

      if (dryRun) continue

      if (!resolved.voiceId) {
        throw new Error(
          `No voice for ${label}. Set ${section.envVoiceKey || "ELEVENLABS_VOICE_ID"} in .env.local`,
        )
      }

      mkdirSync(outDir, { recursive: true })
      const stream = await synthesize({
        speechText: spokenText,
        voiceId: resolved.voiceId,
        languageCode: localeTarget.languageCode,
      })
      await pipeline(stream, createWriteStream(outPath))
      generated += 1
      await new Promise((r) => setTimeout(r, 200))
    }
  }
}

console.log(`Done. generated=${generated} skipped=${skipped}`)
