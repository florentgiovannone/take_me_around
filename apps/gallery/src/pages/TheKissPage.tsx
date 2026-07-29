import { useSearchParams } from "react-router-dom"
import Footer from "../components/Footer"
import SectionAudio from "../components/SectionAudio"
import kissImage from "../assets/gallery/images/the-kiss.jpg"
import { detectTheKissLocale, resolveTheKissCopy } from "../utils/theKissLocale"
import "../styles/style.css"
import "../styles/the-kiss.css"

const WORK_SLUG = "the-kiss"

export default function TheKissPage() {
  const [searchParams] = useSearchParams()
  const locale = detectTheKissLocale(searchParams)
  const copy = resolveTheKissCopy(locale)

  return (
    <>
      <a href="/underlying-technology" className="tma-banner-link">
        <p className="tma-banner-text">
          <strong>{copy.banner}</strong>
        </p>
      </a>
      <div className="the-kiss">
        <article className="page">
          <div className="eyebrow">
            {copy.eyebrowParts.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span className="dot">✦</span> : null}
                {part}
              </span>
            ))}
          </div>

          <h1>
            {copy.title} <em>{copy.titleEm}</em>
          </h1>
          <div className="subtitle">{copy.subtitle}</div>

          <div className="rule" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4 12c3-6 13-6 16 0M4 12c3 6 13 6 16 0" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
            </svg>
          </div>

          <figure className="plate">
            <div className="frame">
              <img src={kissImage} alt={copy.imageAlt} />
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
                {section.quote ? (
                  <blockquote>
                    &quot;{section.quote}&quot;
                    <cite>{section.quoteCite}</cite>
                  </blockquote>
                ) : null}
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
