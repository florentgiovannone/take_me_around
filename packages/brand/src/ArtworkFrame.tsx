import type { CSSProperties, ReactNode } from "react"
import { ArtworkTextSize, useArtworkTextScale } from "./ArtworkTextSize"
import { BrandHeader } from "./BrandHeader"

export type ArtworkSection = {
  heading: string
  paragraphs: readonly string[]
}

export function ArtworkFrame({
  title,
  detail,
  subtitle,
  bannerTop,
  bannerBottom,
  bannerHref = "/underlying-technology",
  audio,
  imageSrc,
  imageAlt,
  sections,
}: {
  title: string
  detail?: string
  subtitle: string
  bannerTop?: string
  bannerBottom?: string
  bannerHref?: string
  audio?: ReactNode
  imageSrc: string
  imageAlt: string
  sections: readonly ArtworkSection[]
}) {
  const { scale, choose } = useArtworkTextScale()

  return (
    <main
      className="tma-brand-page"
      style={{ "--tma-type-scale": scale } as CSSProperties}
    >
      <BrandHeader />
      <header className="tma-brand-hero">
        <h1>{title}</h1>
        {detail ? <p className="tma-brand-hero-detail">{detail}</p> : null}
        <p>{subtitle}</p>
      </header>
      <div className="tma-brand-column">
        <ArtworkTextSize scale={scale} onChange={choose} />
        {bannerTop ? (
          <a className="tma-brand-banner" href={bannerHref}>
            {bannerTop}
          </a>
        ) : null}
        {audio ?? null}
        <img className="tma-brand-image" src={imageSrc} alt={imageAlt} />
        {sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </section>
        ))}
        {bannerBottom ? (
          <a className="tma-brand-banner" href={bannerHref}>
            {bannerBottom}
          </a>
        ) : null}
      </div>
    </main>
  )
}
