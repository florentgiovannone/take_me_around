import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/museum"
import {
  detectRosettaStoneLocale,
  resolveRosettaStoneCopy,
} from "../utils/rosettaStoneLocale"

const ARTWORK_SLUG = "rosetta-stone"

export default function RosettaStonePage() {
  const [searchParams] = useSearchParams()
  const locale = detectRosettaStoneLocale(searchParams)
  const copy = resolveRosettaStoneCopy(locale)
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
          { heading: copy.aboutStoneHeading, paragraphs: copy.aboutStoneParagraphs },
          { heading: copy.aboutCultHeading, paragraphs: copy.aboutCultParagraphs },
        ]}
      />
      <Footer />
    </>
  )
}
