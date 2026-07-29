import Footer from "../components/Footer"
import "../styles/style.css"
import SectionAudio from "../components/SectionAudio"
import { STOP_IMAGES } from "../assets/church-of-england"
import { westminsterAbbeyCopy as copy } from "../data/westminsterAbbey"

const WORK_SLUG = "westminster-abbey"

export default function WestminsterAbbeyPage() {
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
          <img
            src={STOP_IMAGES[WORK_SLUG]!}
            alt={copy.imageAlt}
            className="tma-painting-image"
          />
          <SectionAudio workSlug={WORK_SLUG} sectionId="about" />
          <h2>{copy.aboutHeading}</h2>
          {copy.aboutParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          <SectionAudio workSlug={WORK_SLUG} sectionId="history" />
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
