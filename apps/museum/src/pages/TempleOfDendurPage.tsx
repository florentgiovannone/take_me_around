import type { CSSProperties } from "react"
import { useSearchParams } from "react-router-dom"
import { ArtworkTextSize, BrandHeader, useArtworkTextScale } from "@tma/brand"
import Footer from "../components/Footer"
import SectionAudio from "../components/SectionAudio"
import templeImage from "../assets/museum/images/temple-of-dendur.jpg"
import {
  detectTempleOfDendurLocale,
  resolveTempleOfDendurCopy,
} from "../utils/templeOfDendurLocale"
import "../styles/style.css"
import "../styles/the-temple-of-dendur.css"

const WORK_SLUG = "the-temple-of-dendur"

export default function TempleOfDendurPage() {
  const [searchParams] = useSearchParams()
  const locale = detectTempleOfDendurLocale(searchParams)
  const copy = resolveTempleOfDendurCopy(locale)
  const { scale, choose } = useArtworkTextScale()

  return (
    <>
      <BrandHeader />
      <div className="the-temple-of-dendur" style={{ "--tma-type-scale": scale } as CSSProperties}>
        <article className="page">
          <div className="eyebrow">
            {copy.eyebrowParts.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span className="dot">✦</span> : null}
                {part}
              </span>
            ))}
          </div>

          <h1>{copy.title}</h1>
          <div className="subtitle">{copy.subtitle}</div>

          <ArtworkTextSize scale={scale} onChange={choose} />

          <figure className="plate">
            <div className="frame">
              <img src={templeImage} alt={copy.imageAlt} />
            </div>
            <figcaption>
              <span>{copy.figcaption}</span>
              <span className="credit">{copy.credit}</span>
            </figcaption>
          </figure>

          <div className="facts">
            {copy.facts.map((fact) => (
              <div key={fact.k}>
                <span className="k">{fact.k}</span>
                <span className="v">{fact.v}</span>
              </div>
            ))}
          </div>

          <div className="essay">
            <SectionAudio workSlug={WORK_SLUG} sectionId="intro" locale={locale} />
            <p className="lede">{copy.lede}</p>

            {copy.sections.map((section) => (
              <div key={section.id}>
                <SectionAudio workSlug={WORK_SLUG} sectionId={section.id} locale={locale} />
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
                {section.motifs ? (
                  <ul className="motifs">
                    {section.motifs.map((motif) => (
                      <li key={motif.label}>
                        <strong>{motif.label}</strong> {motif.text}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.afterNote ? <p>{section.afterNote}</p> : null}
                {section.visitBody ? (
                  <div className="visit">
                    {section.visitLabel ? <strong>{section.visitLabel}</strong> : null}{" "}
                    {section.visitBody}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <footer className="colophon">
            <span>{copy.colophonLeft}</span>
            <span>{copy.colophonRight}</span>
          </footer>
          <a className="tma-brand-banner" href="/underlying-technology">
            {copy.banner}
          </a>
        </article>
      </div>
      <Footer />
    </>
  )
}
