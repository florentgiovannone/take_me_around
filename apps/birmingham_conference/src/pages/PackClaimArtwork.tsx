import { useState, type CSSProperties } from "react"
import { ArtworkTextSize, BrandHeader } from "@tma/brand"
import { PACK_CLAIM_AUDIO_HINT, type PackClaimArtworkSection, type PackClaimArtworkTeaser } from "../packClaim"

function PackClaimLockedAudio() {
  const [hint, setHint] = useState(false)

  return (
    <div className="tma-audio-pill-anchor birmingham-pack-locked-audio">
      <button
        type="button"
        className="birmingham-pack-locked-audio-hit"
        aria-label="Play audio"
        onClick={() => setHint(true)}
      >
        <div className="tma-navy-pill">
          <span className="tma-navy-pill-btn">
            <span className="tma-navy-pill-play" aria-hidden="true" />
          </span>
          <div className="tma-navy-pill-mid">
            <div className="tma-navy-pill-top">
              <span className="tma-navy-pill-kicker">Listen</span>
              <span className="tma-navy-pill-time">--:-- / --:--</span>
            </div>
            <div className="tma-navy-pill-track">
              <span className="tma-navy-pill-fill" />
            </div>
          </div>
        </div>
      </button>
      {hint ? <p className="birmingham-pack-audio-hint">{PACK_CLAIM_AUDIO_HINT}</p> : null}
    </div>
  )
}

export function PackClaimArtworkCopy({
  sections,
}: {
  sections: readonly PackClaimArtworkSection[]
}) {
  return (
    <div className="tma-brand-column birmingham-pack-artwork-copy">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </section>
      ))}
    </div>
  )
}

export default function PackClaimArtwork({
  teaser,
  scale,
  onChooseScale,
}: {
  teaser: PackClaimArtworkTeaser
  scale: number
  onChooseScale: (scale: number) => void
}) {
  return (
    <div
      className="tma-brand-page birmingham-pack-artwork"
      style={{ "--tma-type-scale": scale } as CSSProperties}
    >
      <BrandHeader homeHref="#" />
      <header className="tma-brand-hero">
        <h1>{teaser.title}</h1>
        {teaser.detail ? <p className="tma-brand-hero-detail">{teaser.detail}</p> : null}
        <p>{teaser.subtitle}</p>
      </header>
      <div className="tma-brand-column">
        <ArtworkTextSize scale={scale} onChange={onChooseScale} />
        <PackClaimLockedAudio />
        <img className="tma-brand-image" src={teaser.imageSrc} alt={teaser.imageAlt} />
      </div>
    </div>
  )
}
