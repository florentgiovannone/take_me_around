#!/usr/bin/env node
/**
 * Generate localized artwork MP3s via ElevenLabs TTS.
 *
 * Usage:
 *   node scripts/generate-artwork-audio.mjs --artwork two-fridas
 *   node scripts/generate-artwork-audio.mjs --artwork hoa-hakananai --locale de
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import { ARTWORK_LOCALE_TARGETS } from "./artwork-locales.config.mjs"
import { ARTWORKS } from "./artworks.config.mjs"
import { ELEVENLABS_DEFAULTS } from "./elevenlabs.config.mjs"
import { buildArtworkAudioScript } from "./lib/artwork-audio-script.mjs"
import { loadEnvLocal } from "./lib/load-env.mjs"

loadEnvLocal()

const __dirname = dirname(fileURLToPath(import.meta.url))
const museumRoot = join(__dirname, "..")
const galleryRoot = join(museumRoot, "../gallery")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const force = args.includes("--force")
const artworkSlug = args.includes("--artwork") ? args[args.indexOf("--artwork") + 1] : null
const onlyLocale = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : null
const onlyLocales = args.includes("--locales") ? args[args.indexOf("--locales") + 1] : null

const apiKey = process.env.ELEVENLABS_API_KEY
const modelId = process.env.ELEVENLABS_MODEL_ID ?? ELEVENLABS_DEFAULTS.modelId

const artwork = artworkSlug ? ARTWORKS[artworkSlug] : null
if (!artwork) {
  console.error(`Pass --artwork ${Object.keys(ARTWORKS).join(" | ")}`)
  process.exit(1)
}

const appRoot = artwork.app === "gallery" ? galleryRoot : museumRoot

const LOCALES = ARTWORK_LOCALE_TARGETS.map((entry) => ({
  code: entry.locale,
  copyFile: `${artwork.dataBase}.${entry.locale}.ts`,
  voiceId:
    process.env[entry.envVoiceKey] ??
    entry.voiceId ??
    (entry.locale === "tr" ? process.env.ELEVENLABS_VOICE_ID : undefined),
  voiceLabel: entry.label,
  languageCode: entry.languageCode,
}))

function parseLocaleCopy(filePath) {
  const source = readFileSync(filePath, "utf8")
  const match = source.match(/=\s*(\{[\s\S]*\})\s*$/)
  if (!match) {
    throw new Error(`Could not parse locale copy at ${filePath}`)
  }
  return JSON.parse(match[1])
}

async function synthesize({ locale, speechText, voiceId, languageCode }) {
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
    throw new Error(`ElevenLabs failed for ${locale}: ${response.status} ${detail}`)
  }

  if (!response.body) {
    throw new Error(`ElevenLabs returned empty body for ${locale}`)
  }

  return Readable.fromWeb(response.body)
}

function filterLocales() {
  if (onlyLocales) {
    const wanted = new Set(onlyLocales.split(",").map((value) => value.trim().toLowerCase()))
    return LOCALES.filter((entry) => wanted.has(entry.code))
  }

  if (onlyLocale) {
    return LOCALES.filter((entry) => entry.code === onlyLocale.toLowerCase())
  }

  return LOCALES
}

if (!dryRun && !apiKey) {
  console.error(
    "Set ELEVENLABS_API_KEY in apps/museum/.env.local or apps/arkin_museum/.env.local",
  )
  process.exit(1)
}

const targets = filterLocales()
if (targets.length === 0) {
  console.error(`Unknown locale filter; use --locale de or --locales ar,de,es`)
  process.exit(1)
}

for (const target of targets) {
  if (!target.voiceId) {
    console.error(`  failed ${target.code}/${artwork.slug}: missing voice ID`)
    continue
  }

  const copyPath = join(appRoot, "src/data", target.copyFile)
  const copy = parseLocaleCopy(copyPath)
  const speechText = buildArtworkAudioScript(copy, artwork.sections).replace(/^\uFEFF/, "").trim()

  console.log(
    `${dryRun ? "dry-run" : "generate"} ${target.code}/${artwork.slug}: ${speechText.length} chars (${target.voiceLabel} ${target.voiceId})`,
  )

  if (dryRun) continue

  const appRootForAudio = artwork.app === "gallery" ? galleryRoot : museumRoot
  const assetsDir = artwork.app === "gallery" ? "gallery" : "museum"
  const audioDir = join(appRootForAudio, "src/assets", assetsDir, "audio", target.code)
  mkdirSync(audioDir, { recursive: true })
  const outPath = join(audioDir, `${artwork.slug}.mp3`)

  if (existsSync(outPath) && !force) {
    console.log(`  skip ${target.code}/${artwork.slug} (exists; pass --force to overwrite)`)
    continue
  }

  try {
    const audioStream = await synthesize({
      locale: target.code,
      speechText,
      voiceId: target.voiceId,
      languageCode: target.languageCode,
    })

    await pipeline(audioStream, createWriteStream(outPath))
    console.log(`  wrote ${outPath}`)
  } catch (error) {
    console.error(`  failed ${target.code}/${artwork.slug}: ${error.message}`)
  }
}

console.log(dryRun ? "Dry run complete." : "Done.")
