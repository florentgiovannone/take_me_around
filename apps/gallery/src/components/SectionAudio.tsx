import AudioPlayer from "./AudioPlayer"
import { getSectionAudio } from "../assets/gallery/sectionAudio"
import type { ArtworkLocale } from "../assets/gallery/audio"

type SectionAudioProps = {
  workSlug: string
  sectionId: string
  locale?: ArtworkLocale
}

/** Renders a section player when the matching mp3 exists. */
export default function SectionAudio({ workSlug, sectionId, locale = "en" }: SectionAudioProps) {
  const src = getSectionAudio(workSlug, sectionId, locale)
  if (!src) return null
  return <AudioPlayer src={src} />
}
