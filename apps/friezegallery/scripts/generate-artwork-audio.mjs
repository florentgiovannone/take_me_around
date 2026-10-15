/**
 * Regenerate Frieze artwork narration.
 * English stays at public/audio/{slug}.mp3.
 * Other languages use the same voices as the gallery and museum apps
 * and are written to public/audio/{locale}/{slug}.mp3.
 *
 *   node --experimental-strip-types scripts/generate-artwork-audio.mjs
 *   node --experimental-strip-types scripts/generate-artwork-audio.mjs --locale fr
 *   node --experimental-strip-types scripts/generate-artwork-audio.mjs --locale en --force
 *   node --experimental-strip-types scripts/generate-artwork-audio.mjs --dry-run
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { ARTWORK_LOCALE_TARGETS } from "../../museum/scripts/artwork-locales.config.mjs"
import { artworks } from "../src/artworks.ts"
import { buildArtworkAudioScript } from "../src/audioScript.ts"

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = path.resolve(appRoot, "../..")
const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const force = args.includes("--force")
const onlyLocale = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : null

function loadEnv(relativePath) {
  const filePath = path.join(repoRoot, relativePath)
  if (!existsSync(filePath)) return {}
  const values = {}
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (!match) continue
    values[match[1]] = match[2].trim().replace(/^["']|["']$/g, "")
  }
  return values
}

const museum = loadEnv("apps/museum/.env.local")
const church = loadEnv("apps/church_of_england/.env.local")
const arkin = loadEnv("apps/arkin_museum/.env.local")

function firstValue(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) ?? ""
}

const env = { ...museum, ...church, ...arkin }
const apiKey = firstValue(
  process.env.ELEVENLABS_API_KEY,
  church.ELEVENLABS_API_KEY,
  arkin.ELEVENLABS_API_KEY,
  museum.ELEVENLABS_API_KEY,
)
const englishVoiceId = firstValue(
  process.env.ELEVENLABS_VOICE_ID,
  arkin.ELEVENLABS_VOICE_ID,
  church.ELEVENLABS_VOICE_ID,
  museum.ELEVENLABS_VOICE_ID,
)

const targets =
  onlyLocale === "en"
    ? [{ locale: "en", label: "English", voiceId: englishVoiceId, languageCode: "en" }]
    : ARTWORK_LOCALE_TARGETS.filter((entry) => !onlyLocale || entry.locale === onlyLocale).map(
        (entry) => ({
          locale: entry.locale,
          label: entry.label,
          voiceId: env[entry.envVoiceKey] || entry.voiceId || englishVoiceId,
          languageCode: entry.languageCode,
        }),
      )

if (targets.length === 0) {
  console.error("Unknown --locale. Use en, fr, ja, ar, de, es, ko, zh, pt, tr, or it.")
  process.exit(1)
}

if (!dryRun && !apiKey?.startsWith("sk_")) {
  console.error("Missing ElevenLabs key.")
  process.exit(1)
}

const outDir = path.join(appRoot, "public/audio")

for (const target of targets) {
  if (!target.voiceId) {
    console.error(`Missing voice for ${target.locale}.`)
    process.exit(1)
  }

  for (const artwork of artworks) {
    const text = buildArtworkAudioScript(artwork, target.locale)
    const fileName = path.basename(artwork.audioSrc)
    const dir = target.locale === "en" ? outDir : path.join(outDir, target.locale)
    const outPath = path.join(dir, fileName)

    if (dryRun) {
      console.log(`\n--- ${target.locale}/${fileName} (${target.label}) ---\n${text}`)
      continue
    }

    if (existsSync(outPath) && !force) {
      console.log(`skip ${target.locale}/${fileName}`)
      continue
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${target.voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        language_code: target.languageCode,
        apply_text_normalization: "on",
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`${target.locale}/${fileName} ${response.status} ${detail.slice(0, 300)}`)
    }

    const bytes = Buffer.from(await response.arrayBuffer())
    mkdirSync(dir, { recursive: true })
    writeFileSync(outPath, bytes)
    console.log(`${target.locale}/${fileName} ${bytes.length}`)
  }
}
