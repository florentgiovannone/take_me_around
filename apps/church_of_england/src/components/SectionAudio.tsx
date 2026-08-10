import AudioPlayer from "./AudioPlayer"
import { getSectionAudio } from "../assets/church-of-england"

type SectionAudioProps = {
  workSlug: string
  sectionId: string
  /** When true, show the headphones listen hint above the player (Southwell History). */
  showHint?: boolean
  /** When true, show the headphones glyph above the player (Southwell sections without hint). */
  showIcon?: boolean
}

const HINT_COPY =
  "Where you see the audio control below, and in each section where you see an audio icon, you can listen as you browse or move around. Please use your headphones or ear pods."

function HeadphonesIcon({ decorative }: { decorative: boolean }) {
  return (
    <svg
      className="tma-headphones-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "Headphones"}
    >
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

/** Renders a section player when the matching mp3 exists. */
export default function SectionAudio({
  workSlug,
  sectionId,
  showHint = false,
  showIcon = false,
}: SectionAudioProps) {
  const src = getSectionAudio(workSlug, sectionId)
  if (!src) return null

  if (!showHint && !showIcon) {
    return <AudioPlayer src={src} />
  }

  return (
    <div className="tma-section-audio-block">
      {showHint ? (
        <p className="tma-audio-listen-hint">
          <HeadphonesIcon decorative />
          <span>{HINT_COPY}</span>
        </p>
      ) : (
        <div className="tma-section-audio-icon" aria-hidden={false}>
          <HeadphonesIcon decorative={false} />
        </div>
      )}
      <AudioPlayer src={src} />
    </div>
  )
}
