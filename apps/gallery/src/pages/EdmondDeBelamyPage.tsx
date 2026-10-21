import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/gallery"
import {
  detectEdmondDeBelamyLocale,
  resolveEdmondDeBelamyCopy,
} from "../utils/edmondDeBelamyLocale"

const ARTWORK_SLUG = "edmond-de-belamy"

export default function EdmondDeBelamyPage() {
  const [searchParams] = useSearchParams()
  const locale = detectEdmondDeBelamyLocale(searchParams)
  const copy = resolveEdmondDeBelamyCopy(locale)
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
          { heading: copy.aboutPaintingHeading, paragraphs: copy.aboutPaintingParagraphs },
          { heading: copy.aboutArtistHeading, paragraphs: copy.aboutArtistParagraphs },
        ]}
      />
      <Footer />
    </>
  )
}
