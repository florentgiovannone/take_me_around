import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/museum"
import {
  detectRoyalGameOfUrLocale,
  resolveRoyalGameOfUrCopy,
} from "../utils/royalGameOfUrLocale"
import { useSearchParams } from "react-router-dom"

const ARTWORK_SLUG = "royal-game-of-ur"

export default function RoyalGameOfUrPage() {
  const [searchParams] = useSearchParams()
  const locale = detectRoyalGameOfUrLocale(searchParams)
  const copy = resolveRoyalGameOfUrCopy(locale)
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

          <h2>{copy.aboutGameHeading}</h2>
          {copy.aboutGameParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}

          <h2>{copy.aboutSumeriansHeading}</h2>
          {copy.aboutSumeriansParagraphs.map((paragraph) => (
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
