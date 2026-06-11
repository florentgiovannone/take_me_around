import { ELEVENLABS_DEFAULTS } from "../elevenlabs.config.mjs"

function normalizeName(name) {
  return name.toLowerCase().replace(/\s+/g, " ").trim()
}

function scoreVoice(voice, targetName) {
  const name = normalizeName(voice.name ?? "")
  const target = normalizeName(targetName)
  if (name === target) return 100
  if (name.includes(target) || target.includes(name)) return 80
  if (name.includes("florence") && name.includes("british")) return 70
  if (name.includes("florence")) return 50
  return 0
}

export async function listVoices(apiKey) {
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": apiKey },
  })

  if (!response.ok) {
    const body = await response.text()
    if (response.status === 401 && body.includes("voices_read")) {
      throw new Error(
        "API key cannot list voices (missing voices_read permission).\n\n" +
          "Copy Florence's voice ID manually:\n" +
          "  ElevenLabs → Voices → My Voices → Florence → ⋯ → Copy voice ID\n\n" +
          "Add to .env.local:\n" +
          "  ELEVENLABS_VOICE_ID=paste_id_here\n\n" +
          "Or enable voices_read when creating a new API key.",
      )
    }
    throw new Error(`Failed to list voices: ${response.status} ${body}`)
  }

  const data = await response.json()
  return data.voices ?? []
}

export async function resolveVoiceId(apiKey, options = {}) {
  const voiceName = options.voiceName ?? ELEVENLABS_DEFAULTS.voiceName
  const configuredId = options.voiceId ?? ELEVENLABS_DEFAULTS.voiceId

  if (configuredId) return { voiceId: configuredId, voiceName, source: "config" }

  const voices = await listVoices(apiKey)
  const ranked = voices
    .map((voice) => ({ voice, score: scoreVoice(voice, voiceName) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  if (ranked.length === 0) {
    const sample = voices
      .slice(0, 8)
      .map((v) => `  - ${v.name} (${v.voice_id})`)
      .join("\n")
    throw new Error(
      `No voice matching "${voiceName}". Run: npm run audio:voices\n\nFirst voices in your account:\n${sample}`,
    )
  }

  const best = ranked[0].voice
  return { voiceId: best.voice_id, voiceName: best.name, source: "lookup" }
}
