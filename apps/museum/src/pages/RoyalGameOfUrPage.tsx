import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/museum"
import {
  detectRoyalGameOfUrLocale,
  resolveRoyalGameOfUrCopy,
} from "../utils/royalGameOfUrLocale"

const ARTWORK_SLUG = "royal-game-of-ur"

export default function RoyalGameOfUrPage() {
  const [searchParams] = useSearchParams()
  const locale = detectRoyalGameOfUrLocale(searchParams)
  const copy = resolveRoyalGameOfUrCopy(locale)
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
          { heading: copy.aboutGameHeading, paragraphs: copy.aboutGameParagraphs },
          { heading: copy.aboutSumeriansHeading, paragraphs: copy.aboutSumeriansParagraphs },
        ]}
      />
      <Footer />
    </>
  )
}
