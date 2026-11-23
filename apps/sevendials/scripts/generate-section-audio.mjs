#!/usr/bin/env node
/**
 * Generate per-section MP3s for Seven Dials Trust People's Plaques via ElevenLabs.
 *
 * Usage:
 *   node scripts/generate-section-audio.mjs
 *   node scripts/generate-section-audio.mjs --work charles-boon
 *   node scripts/generate-section-audio.mjs --work brian-epstein --section in-situ
 *   node scripts/generate-section-audio.mjs --dry-run
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import { SECTION_AUDIO_WORKS } from "./section-audio.config.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = join(__dirname, "..")
const churchRoot = join(appRoot, "../church_of_england")
const arkinRoot = join(appRoot, "../arkin_museum")
const museumRoot = join(appRoot, "../museum")
const audioRoot = join(appRoot, "src/assets/sevendials/audio")

function loadEnvLocal() {
  for (const root of [appRoot, churchRoot, arkinRoot, museumRoot]) {
    const envPath = join(root, ".env.local")
    if (!existsSync(envPath)) continue

    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!(key in process.env)) process.env[key] = value
    }
  }
}

loadEnvLocal()

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const force = args.includes("--force")
const onlyWork = args.includes("--work") ? args[args.indexOf("--work") + 1] : null
const onlySection = args.includes("--section") ? args[args.indexOf("--section") + 1] : null

const apiKey = process.env.ELEVENLABS_API_KEY
const voiceId =
  process.env.ELEVENLABS_VOICE_ID ??
  process.env.ELEVENLABS_VOICE_ID_REV ??
  "McCpKDz9Fm00UGapoXxs"
const modelId = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2"

if (onlyWork && !SECTION_AUDIO_WORKS[onlyWork]) {
  console.error(`Unknown work "${onlyWork}". Options: ${Object.keys(SECTION_AUDIO_WORKS).join(", ")}`)
  process.exit(1)
}

if (!dryRun && !apiKey) {
  console.error("Set ELEVENLABS_API_KEY in .env.local")
  process.exit(1)
}

async function synthesize({ speechText, targetVoiceId }) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: speechText,
      model_id: modelId,
      language_code: "en",
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

const works = onlyWork ? { [onlyWork]: SECTION_AUDIO_WORKS[onlyWork] } : SECTION_AUDIO_WORKS

let generated = 0
let skipped = 0

for (const [workSlug, work] of Object.entries(works)) {
  for (const section of work.sections) {
    if (onlySection && section.id !== onlySection) continue

    const spokenText = `${section.title}. ${section.speechText}`
    const outDir = join(audioRoot, "en", workSlug)
    const outPath = join(outDir, `${section.id}.mp3`)
    const label = `en/${workSlug}/${section.id}`

    if (existsSync(outPath) && !force) {
      console.log(`skip ${label} (exists; use --force to overwrite)`)
      skipped += 1
      continue
    }

    console.log(`${dryRun ? "dry-run" : "generate"} ${label}: ${spokenText.length} chars — ${section.title}`)
    if (dryRun) continue

    mkdirSync(outDir, { recursive: true })
    const stream = await synthesize({
      speechText: spokenText,
      targetVoiceId: voiceId,
    })
    await pipeline(stream, createWriteStream(outPath))
    generated += 1
    await new Promise((r) => setTimeout(r, 200))
  }
}

console.log(`Done. generated=${generated} skipped=${skipped}`)
