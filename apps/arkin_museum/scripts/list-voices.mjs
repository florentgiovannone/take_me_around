#!/usr/bin/env node
/**
 * List ElevenLabs voices in your account (helps find Florence's voice ID).
 * Usage: ELEVENLABS_API_KEY=... node scripts/list-voices.mjs [search]
 */
import { ELEVENLABS_DEFAULTS } from "./elevenlabs.config.mjs"
import { loadEnvLocal } from "./lib/load-env.mjs"
import { listVoices } from "./lib/resolve-voice.mjs"

loadEnvLocal()

const apiKey = process.env.ELEVENLABS_API_KEY
const query = (process.argv[2] ?? ELEVENLABS_DEFAULTS.voiceName).toLowerCase()

if (!apiKey) {
  console.error("Set ELEVENLABS_API_KEY to list voices.")
  process.exit(1)
}

const voices = await listVoices(apiKey)
const matches = voices.filter((v) => v.name?.toLowerCase().includes(query))

console.log(`Voices matching "${query}":\n`)
for (const voice of matches.length ? matches : voices) {
  console.log(`${voice.name}`)
  console.log(`  id: ${voice.voice_id}`)
  if (voice.labels) console.log(`  labels: ${JSON.stringify(voice.labels)}`)
  console.log()
}

if (matches.length === 1) {
  console.log(`Add to scripts/elevenlabs.config.mjs:`)
  console.log(`  voiceId: "${matches[0].voice_id}",`)
}
