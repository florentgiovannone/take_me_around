#!/usr/bin/env node
/**
 * Generate Rodin exhibition MP3s via ElevenLabs TTS.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=... node scripts/generate-audio.mjs
 *   ELEVENLABS_API_KEY=... node scripts/generate-audio.mjs --slug the-secret
 *   node scripts/generate-audio.mjs --dry-run
 *
 * Voice: Florence - Natural British Voice (see scripts/elevenlabs.config.mjs)
 * Set ELEVENLABS_VOICE_ID in .env.local (required if your key lacks voices_read).
 */
import { execSync } from "node:child_process"
import { createWriteStream, existsSync, mkdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import { ELEVENLABS_DEFAULTS } from "./elevenlabs.config.mjs"
import { loadEnvLocal } from "./lib/load-env.mjs"
import { resolveVoiceId } from "./lib/resolve-voice.mjs"

loadEnvLocal()

const __dirname = dirname(fileURLToPath(import.meta.url))
const AUDIO_DIR = join(__dirname, "../src/assets/Audio/rodin")
const SCRIPTS_JSON = join(__dirname, "rodin-audio-scripts.json")

const args = process.argv.slice(2)
const onlySlug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null
const locale = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : "en"
const dryRun = args.includes("--dry-run")
const force = args.includes("--force")
const voiceIdArg = args.includes("--voice-id") ? args[args.indexOf("--voice-id") + 1] : null

const SCRIPTS_DIR = join(__dirname, "rodin-audio-scripts")

const apiKey = process.env.ELEVENLABS_API_KEY
const modelId = process.env.ELEVENLABS_MODEL_ID ?? ELEVENLABS_DEFAULTS.modelId

if (!existsSync(SCRIPTS_JSON)) {
  execSync("node scripts/export-audio-scripts.mjs", { cwd: join(__dirname, ".."), stdio: "inherit" })
}

const scripts = JSON.parse(readFileSync(SCRIPTS_JSON, "utf8"))
mkdirSync(AUDIO_DIR, { recursive: true })

if (!dryRun && !apiKey) {
  console.error(
    "Set ELEVENLABS_API_KEY to generate audio, or pass --dry-run.\n\n" +
      "  export ELEVENLABS_API_KEY=\"your_key\"\n" +
      "  — or copy .env.example to .env.local and add your key there.",
  )
  process.exit(1)
}

let voiceId =
  voiceIdArg ??
  (locale === "tr"
    ? process.env.ELEVENLABS_VOICE_ID_TR ?? process.env.ELEVENLABS_VOICE_ID
    : process.env.ELEVENLABS_VOICE_ID) ??
  ELEVENLABS_DEFAULTS.voiceId
let voiceLabel = locale === "tr" ? "Turkish voice" : ELEVENLABS_DEFAULTS.voiceName

if (!dryRun && !voiceId) {
  const resolved = await resolveVoiceId(apiKey, {
    voiceName: process.env.ELEVENLABS_VOICE_NAME ?? ELEVENLABS_DEFAULTS.voiceName,
  })
  voiceId = resolved.voiceId
  voiceLabel = resolved.voiceName
  console.log(`Using voice: ${voiceLabel} (${voiceId}) [${resolved.source}]`)
} else if (voiceId) {
  console.log(`Using voice: ${voiceLabel} (${voiceId})`)
} else {
  console.log(`Dry run — voice: ${process.env.ELEVENLABS_VOICE_NAME ?? ELEVENLABS_DEFAULTS.voiceName}`)
}

for (const [slug, text] of Object.entries(scripts)) {
  if (onlySlug && slug !== onlySlug) continue

  const scriptSuffix = locale === "en" ? "" : `.${locale}`
  const localizedScriptPath = join(SCRIPTS_DIR, `${slug}${scriptSuffix}.txt`)
  const speechSource =
    locale !== "en" && existsSync(localizedScriptPath)
      ? readFileSync(localizedScriptPath, "utf8")
      : locale !== "en"
        ? null
        : text

  if (!speechSource) {
    if (onlySlug) {
      console.error(`No ${locale} script at ${localizedScriptPath}`)
      process.exit(1)
    }
    continue
  }

  const fileSlug = locale === "en" ? slug : `${slug}-${locale}`
  const outPath = join(AUDIO_DIR, `${fileSlug}.mp3`)
  if (existsSync(outPath) && !force) {
    console.log(`skip ${slug} (exists)`)
    continue
  }

  const speechText = speechSource.replace(/^\uFEFF/, "").trim()

  console.log(`${dryRun ? "dry-run" : "generate"} ${fileSlug}: ${speechText.length} chars`)

  if (dryRun) continue

  const languageCode = locale === "tr" ? "tr" : "en"

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
    console.error(`Failed ${fileSlug}: ${response.status} ${detail}`)
    process.exit(1)
  }

  if (!response.body) {
    console.error(`Failed ${fileSlug}: empty response body`)
    process.exit(1)
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(outPath))
  console.log(`  wrote ${outPath}`)
}

console.log(dryRun ? "Dry run complete." : `Done. MP3s in ${AUDIO_DIR}`)
