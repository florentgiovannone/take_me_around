import { useSearchParams } from "react-router-dom"
import Footer from "../components/Footer"
import SectionAudio from "../components/SectionAudio"
import templeImage from "../assets/museum/images/temple-of-dendur.jpg"
import {
  detectTempleOfDendurLocale,
  resolveTempleOfDendurCopy,
} from "../utils/templeOfDendurLocale"
import "../styles/style.css"
import "../styles/temple-of-dendur.css"

const WORK_SLUG = "the-temple-of-dendur"

export default function TempleOfDendurPage() {
  const [searchParams] = useSearchParams()
  const locale = detectTempleOfDendurLocale(searchParams)
  const copy = resolveTempleOfDendurCopy(locale)
  const looking = copy.sections.find((section) => section.visitLabel && section.visitBody)

  return (
    <>
      <a href="/underlying-technology" className="tma-banner-link">
        <p className="tma-banner-text">
          <strong>{copy.banner}</strong>
        </p>
      </a>
      <div className="temple-of-dendur">
        <article className="page">
          <div className="eyebrow">
            {copy.eyebrowParts.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span className="dot">◆</span> : null}
                {part}{" "}
              </span>
            ))}
          </div>

          <h1>{copy.title}</h1>
          <div className="subtitle">{copy.subtitle}</div>

          <div className="rule" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M2 20h20M4 20V9l8-5 8 5v11M8 20v-7h8v7M11 4V2h2v2" />
            </svg>
          </div>

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
                        <strong>{motif.label}.</strong> {motif.text}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.afterNote ? <p className="small">{section.afterNote}</p> : null}
              </div>
            ))}

            {looking ? (
              <div className="visit">
                <strong>{looking.visitLabel}</strong> {looking.visitBody}
              </div>
            ) : null}
          </div>

          <footer className="colophon">
            <span>{copy.colophonLeft}</span>
            <span>{copy.colophonRight}</span>
          </footer>
        </article>
      </div>

      <a href="/underlying-technology" className="tma-banner-link">
        <p className="tma-banner-text">
          <strong>{copy.banner}</strong>
        </p>
      </a>
      <Footer />
    </>
  )
}
