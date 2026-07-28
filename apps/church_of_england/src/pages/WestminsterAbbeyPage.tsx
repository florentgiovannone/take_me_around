import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { STOP_IMAGES, getStopAudio } from "../assets/church-of-england"
import { westminsterAbbeyCopy as copy } from "../data/westminsterAbbey"

const STOP_SLUG = "westminster-abbey"

export default function WestminsterAbbeyPage() {
  const audioSrc = getStopAudio(STOP_SLUG)
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
            src={STOP_IMAGES[STOP_SLUG]!}
            alt={copy.imageAlt}
            className="tma-painting-image"
          />
          <h2>{copy.aboutHeading}</h2>
          {copy.aboutParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          <h2>{copy.historyHeading}</h2>
          {copy.historyParagraphs.map((paragraph) => (
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
