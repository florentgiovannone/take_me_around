#!/usr/bin/env node
/**
 * Generate per-section English MP3s for CoE exhibit pages via ElevenLabs.
 *
 * Usage:
 *   node scripts/generate-section-audio.mjs
 *   node scripts/generate-section-audio.mjs --work southwell-minster
 *   node scripts/generate-section-audio.mjs --work westminster-abbey --section history
 *   node scripts/generate-section-audio.mjs --dry-run
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import { SECTION_AUDIO_WORKS } from "./section-audio.config.mjs"
import { loadEnvLocal } from "./lib/load-env.mjs"

loadEnvLocal()

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = join(__dirname, "..")
const audioRoot = join(appRoot, "src/assets/church-of-england/audio/en")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const force = args.includes("--force")
const onlyWork = args.includes("--work") ? args[args.indexOf("--work") + 1] : null
const onlySection = args.includes("--section")
  ? args[args.indexOf("--section") + 1]
  : null

const apiKey = process.env.ELEVENLABS_API_KEY
const voiceId = process.env.ELEVENLABS_VOICE_ID
const modelId = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2"

if (!dryRun && !apiKey) {
  console.error("Set ELEVENLABS_API_KEY in apps/church_of_england/.env.local or apps/arkin_museum/.env.local")
  process.exit(1)
}
if (!dryRun && !voiceId) {
  console.warn(
    "ELEVENLABS_VOICE_ID unset — sections without an explicit voiceId will fail.",
  )
}

function resolveSectionVoiceId(section) {
  if (section.envVoiceKey) {
    const fromEnv = process.env[section.envVoiceKey]
    if (fromEnv) return { voiceId: fromEnv, source: section.envVoiceKey }
    if (section.voiceId) return { voiceId: section.voiceId, source: "config fallback" }
    return { voiceId: null, source: section.envVoiceKey }
  }
  if (section.voiceId) return { voiceId: section.voiceId, source: "config" }
  if (voiceId) return { voiceId, source: "ELEVENLABS_VOICE_ID" }
  return { voiceId: null, source: "ELEVENLABS_VOICE_ID" }
}

async function synthesize(speechText, resolvedVoiceId) {
  if (!resolvedVoiceId) {
    throw new Error("Missing voice id (section envVoiceKey / voiceId or ELEVENLABS_VOICE_ID)")
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}`, {
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

const works = onlyWork
  ? { [onlyWork]: SECTION_AUDIO_WORKS[onlyWork] }
  : SECTION_AUDIO_WORKS

if (onlyWork && !SECTION_AUDIO_WORKS[onlyWork]) {
  console.error(`Unknown work "${onlyWork}". Options: ${Object.keys(SECTION_AUDIO_WORKS).join(", ")}`)
  process.exit(1)
}

let generated = 0
let skipped = 0

for (const [workSlug, work] of Object.entries(works)) {
  for (const section of work.sections) {
    if (onlySection && section.id !== onlySection) continue

    const outDir = join(audioRoot, workSlug)
    const outPath = join(outDir, `${section.id}.mp3`)
    const label = `${workSlug}/${section.id}`

    if (existsSync(outPath) && !force) {
      console.log(`skip ${label} (exists; use --force to overwrite)`)
      skipped += 1
      continue
    }

    const spokenText =
      section.id === "intro" ? section.speechText : `${section.title}. ${section.speechText}`

    const resolved = resolveSectionVoiceId(section)
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
    const stream = await synthesize(spokenText, resolved.voiceId)
    await pipeline(stream, createWriteStream(outPath))
    generated += 1
  }
}

console.log(`Done. generated=${generated} skipped=${skipped}`)
