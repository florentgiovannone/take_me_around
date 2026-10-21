import type { ReactNode } from "react"
import { BrandHeader } from "./BrandHeader"

export type ArtworkSection = {
  heading: string
  paragraphs: readonly string[]
}

export function ArtworkFrame({
  title,
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
  subtitle: string
  bannerTop?: string
  bannerBottom?: string
  bannerHref?: string
  audio?: ReactNode
  imageSrc: string
  imageAlt: string
  sections: readonly ArtworkSection[]
}) {
  return (
    <main className="tma-brand-page">
      <BrandHeader />
      <header className="tma-brand-hero">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      <div className="tma-brand-column">
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
