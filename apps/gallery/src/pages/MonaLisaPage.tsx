import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/gallery"
import { detectMonaLisaLocale, resolveMonaLisaCopy } from "../utils/monaLisaLocale"
import { useSearchParams } from "react-router-dom"

const ARTWORK_SLUG = "mona-lisa"

export default function MonaLisaPage() {
  const [searchParams] = useSearchParams()
  const locale = detectMonaLisaLocale(searchParams)
  const copy = resolveMonaLisaCopy(locale)
  const audioSrc = getArtworkAudio(ARTWORK_SLUG, locale)

  return (
    <>
      <main className="tma-gallery-page">
        <header className="tma-header">
          <div className="tma-header-inner">
            <h1 className="tma-page-title">{copy.title}</h1>
            <p className="tma-page-subtitle">{copy.subtitle}</p>
          </div>
        </header>

        <a href="/underlying-technology" className="tma-banner-link">
          <p className="tma-banner-text">
            <strong>{copy.bannerTop}</strong>
          </p>
        </a>

        <div className="tma-content">
          {audioSrc ? <AudioPlayer src={audioSrc} /> : null}
          <img
            src={ARTWORK_IMAGES[ARTWORK_SLUG]!}
            alt={copy.imageAlt}
            className="tma-painting-image"
          />

          <h2>{copy.aboutPaintingHeading}</h2>
          {copy.aboutPaintingParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}

          <h2>{copy.aboutArtistHeading}</h2>
          {copy.aboutArtistParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        <a href="/underlying-technology" className="tma-banner-link">
          <p className="tma-banner-text">
            <strong>{copy.bannerBottom}</strong>
          </p>
        </a>
      </main>
      <Footer />
    </>
  )
}
