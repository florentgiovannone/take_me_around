import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import AudioPlayer from "../components/AudioPlayer"
import { getArtworkAudio } from "../assets/gallery"
import {
  detectStarOfBethlehemLocale,
  resolveStarOfBethlehemCopy,
} from "../utils/starOfBethlehemLocale"
import "../styles/style.css"

const ARTWORK_SLUG = "star-of-bethlehem"

export default function StarOfBethlehemPage() {
  const [searchParams] = useSearchParams()
  const locale = detectStarOfBethlehemLocale(searchParams)
  const copy = resolveStarOfBethlehemCopy(locale)
  const audioSrc = getArtworkAudio(ARTWORK_SLUG, locale)

  return (
    <>
      <ArtworkFrame
        title={copy.title}
        subtitle={copy.subtitle}
        bannerBottom={copy.bannerBottom}
        imageSrc={copy.imageSrc}
        imageAlt={copy.imageAlt}
        audio={audioSrc ? <AudioPlayer src={audioSrc} /> : undefined}
        sections={[
          { heading: copy.aboutWorkHeading, paragraphs: copy.aboutWorkParagraphs },
          { heading: copy.aboutArtistHeading, paragraphs: copy.aboutArtistParagraphs },
        ]}
      />
      <Footer />
    </>
  )
}
