import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import AudioPlayer from "../components/AudioPlayer"
import { getArtworkAudio } from "../assets/museum"
import {
  detectGoldenBoysLocale,
  resolveGoldenBoysCopy,
} from "../utils/goldenBoysLocale"
import "../styles/style.css"

const ARTWORK_SLUG = "golden-boys"

export default function GoldenBoysPage() {
  const [searchParams] = useSearchParams()
  const locale = detectGoldenBoysLocale(searchParams)
  const copy = resolveGoldenBoysCopy(locale)
  const audioSrc = getArtworkAudio(ARTWORK_SLUG, locale)

  return (
    <>
      <ArtworkFrame
        title={copy.title}
        detail={copy.detail}
        subtitle={copy.subtitle}
        bannerTop={copy.bannerTop}
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
