#!/usr/bin/env node
/**
 * Generate Hoa Hakananaiʻa FR / JA MP3s via ElevenLabs TTS.
 *
 * Usage:
 *   node scripts/generate-hoa-audio.mjs
 *   node scripts/generate-hoa-audio.mjs --locale fr
 *   node scripts/generate-hoa-audio.mjs --dry-run
 *
 * Requires ELEVENLABS_API_KEY in .env.local (museum or arkin_museum).
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, copyFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import { ELEVENLABS_DEFAULTS } from "./elevenlabs.config.mjs"
import { buildHoaAudioScript } from "./lib/hoa-audio-script.mjs"
import { loadEnvLocal } from "./lib/load-env.mjs"

loadEnvLocal()

const __dirname = dirname(fileURLToPath(import.meta.url))
const museumRoot = join(__dirname, "..")
const galleryRoot = join(museumRoot, "../gallery")
const slug = "hoa-hakananai"

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const force = args.includes("--force")
const onlyLocale = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : null

const apiKey = process.env.ELEVENLABS_API_KEY
const modelId = process.env.ELEVENLABS_MODEL_ID ?? ELEVENLABS_DEFAULTS.modelId

const LOCALES = [
  {
    code: "fr",
    copyFile: "hoaHakananai.fr.ts",
    voiceId: process.env.ELEVENLABS_VOICE_ID_FR ?? ELEVENLABS_DEFAULTS.voices.fr.id,
    voiceLabel: ELEVENLABS_DEFAULTS.voices.fr.label,
    languageCode: "fr",
  },
  {
    code: "ja",
    copyFile: "hoaHakananai.ja.ts",
    voiceId: process.env.ELEVENLABS_VOICE_ID_JA ?? ELEVENLABS_DEFAULTS.voices.ja.id,
    voiceLabel: ELEVENLABS_DEFAULTS.voices.ja.label,
    languageCode: "ja",
  },
]

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

if (!dryRun && !apiKey) {
  console.error(
    "Set ELEVENLABS_API_KEY in apps/museum/.env.local or apps/arkin_museum/.env.local",
  )
  process.exit(1)
}

const targets = onlyLocale ? LOCALES.filter((entry) => entry.code === onlyLocale) : LOCALES
if (targets.length === 0) {
  console.error(`Unknown --locale ${onlyLocale}; use fr or ja`)
  process.exit(1)
}

for (const target of targets) {
  const copyPath = join(museumRoot, "src/data", target.copyFile)
  const copy = parseLocaleCopy(copyPath)
  const speechText = buildHoaAudioScript(copy).replace(/^\uFEFF/, "").trim()

  console.log(
    `${dryRun ? "dry-run" : "generate"} ${target.code}/${slug}: ${speechText.length} chars (${target.voiceLabel} ${target.voiceId})`,
  )

  if (dryRun) continue

  const museumAudioDir = join(museumRoot, "src/assets/museum/audio", target.code)
  const galleryAudioDir = join(galleryRoot, "src/assets/gallery/audio", target.code)
  mkdirSync(museumAudioDir, { recursive: true })
  mkdirSync(galleryAudioDir, { recursive: true })

  const museumOutPath = join(museumAudioDir, `${slug}.mp3`)
  const galleryOutPath = join(galleryAudioDir, `${slug}.mp3`)

  if (existsSync(museumOutPath) && !force) {
    console.log(`  skip ${target.code}/${slug} (exists; pass --force to overwrite)`)
    if (!existsSync(galleryOutPath)) {
      copyFileSync(museumOutPath, galleryOutPath)
      console.log(`  copied to ${galleryOutPath}`)
    }
    continue
  }

  const audioStream = await synthesize({
    locale: target.code,
    speechText,
    voiceId: target.voiceId,
    languageCode: target.languageCode,
  })

  await pipeline(audioStream, createWriteStream(museumOutPath))
  console.log(`  wrote ${museumOutPath}`)
  copyFileSync(museumOutPath, galleryOutPath)
  console.log(`  wrote ${galleryOutPath}`)
}

console.log(dryRun ? "Dry run complete." : "Done.")
