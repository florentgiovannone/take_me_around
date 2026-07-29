import westminsterAbbeyImage from "./images/westminster-abbey-placeholder.svg"

export const STOP_IMAGES: Record<string, string> = {
  "westminster-abbey": westminsterAbbeyImage,
}

const sectionAudioModules = import.meta.glob("./audio/en/**/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>

/** Returns a section MP3 URL when the asset exists; otherwise null. */
export function getSectionAudio(workSlug: string, sectionId: string): string | null {
  const key = `./audio/en/${workSlug}/${sectionId}.mp3`
  return sectionAudioModules[key] ?? null
}

/** @deprecated Prefer getSectionAudio for per-section players. */
export function getStopAudio(_slug: string): string | null {
  return null
}
