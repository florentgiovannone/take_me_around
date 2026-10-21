import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/museum"
import {
  detectLewisChessmenLocale,
  resolveLewisChessmenCopy,
} from "../utils/lewisChessmenLocale"

const ARTWORK_SLUG = "lewis-chessmen"

export default function LewisChessmenPage() {
  const [searchParams] = useSearchParams()
  const locale = detectLewisChessmenLocale(searchParams)
  const copy = resolveLewisChessmenCopy(locale)
  const audioSrc = getArtworkAudio(ARTWORK_SLUG, locale)

  return (
    <>
      <ArtworkFrame
        title={copy.title}
        subtitle={copy.subtitle}
        bannerTop={copy.bannerTop}
        bannerBottom={copy.bannerBottom}
        imageSrc={ARTWORK_IMAGES[ARTWORK_SLUG]!}
        imageAlt={copy.imageAlt}
        audio={audioSrc ? <AudioPlayer src={audioSrc} /> : undefined}
        sections={[
          { heading: copy.aboutChessmenHeading, paragraphs: copy.aboutChessmenParagraphs },
          { heading: copy.aboutNorseHeading, paragraphs: copy.aboutNorseParagraphs },
        ]}
      />
      <Footer />
    </>
  )
}
