import westminsterAbbeyImage from "./images/westminster-abbey-placeholder.svg"

export const STOP_IMAGES: Record<string, string> = {
  "westminster-abbey": westminsterAbbeyImage,
}

/** Returns audio URL when an asset exists; null omits the player. */
export function getStopAudio(_slug: string): string | null {
  return null
}
