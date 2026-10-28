import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/gallery"
import {
  detectStarryNightLocale,
  resolveStarryNightCopy,
} from "../utils/starryNightLocale"

const ARTWORK_SLUG = "starry-night"

export default function StarryNightPage() {
  const [searchParams] = useSearchParams()
  const locale = detectStarryNightLocale(searchParams)
  const copy = resolveStarryNightCopy(locale)
  const audioSrc = getArtworkAudio(ARTWORK_SLUG, locale)

  return (
    <>
      <ArtworkFrame
        title={copy.title}
        subtitle={copy.subtitle}
        bannerBottom={copy.bannerBottom}
        imageSrc={ARTWORK_IMAGES[ARTWORK_SLUG]!}
        imageAlt={copy.imageAlt}
        audio={audioSrc ? <AudioPlayer src={audioSrc} /> : undefined}
        sections={[
          { heading: copy.aboutPaintingHeading, paragraphs: copy.aboutPaintingParagraphs },
          { heading: copy.aboutArtistHeading, paragraphs: copy.aboutArtistParagraphs },
        ]}
      />
      <Footer />
    </>
  )
}
