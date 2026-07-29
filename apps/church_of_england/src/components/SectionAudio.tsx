import AudioPlayer from "./AudioPlayer"
import { getSectionAudio } from "../assets/church-of-england"

type SectionAudioProps = {
  workSlug: string
  sectionId: string
}

/** Renders a section player when the matching mp3 exists. */
export default function SectionAudio({ workSlug, sectionId }: SectionAudioProps) {
  const src = getSectionAudio(workSlug, sectionId)
  if (!src) return null
  return <AudioPlayer src={src} />
}
