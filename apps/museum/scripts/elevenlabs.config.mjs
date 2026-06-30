/** Default ElevenLabs settings for museum narration. */
import { ARTWORK_LOCALE_TARGETS } from "./artwork-locales.config.mjs"

export const ELEVENLABS_DEFAULTS = {
  modelId: "eleven_multilingual_v2",
  voices: Object.fromEntries(
    ARTWORK_LOCALE_TARGETS.map((entry) => [
      entry.locale,
      { id: entry.voiceId, label: entry.label },
    ]),
  ),
}
