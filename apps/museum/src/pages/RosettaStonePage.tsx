import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/museum"
import {
  detectRosettaStoneLocale,
  resolveRosettaStoneCopy,
} from "../utils/rosettaStoneLocale"
import { useSearchParams } from "react-router-dom"

const ARTWORK_SLUG = "rosetta-stone"

export default function RosettaStonePage() {
  const [searchParams] = useSearchParams()
  const locale = detectRosettaStoneLocale(searchParams)
  const copy = resolveRosettaStoneCopy(locale)
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

          <h2>{copy.aboutStoneHeading}</h2>
          {copy.aboutStoneParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}

          <h2>{copy.aboutCultHeading}</h2>
          {copy.aboutCultParagraphs.map((paragraph) => (
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
