import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/museum"
import {
  detectSuttonHooHelmetLocale,
  resolveSuttonHooHelmetCopy,
} from "../utils/suttonHooHelmetLocale"

const ARTWORK_SLUG = "sutton-hoo-helmet"

export default function SuttonHooHelmetPage() {
  const [searchParams] = useSearchParams()
  const locale = detectSuttonHooHelmetLocale(searchParams)
  const copy = resolveSuttonHooHelmetCopy(locale)
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
          { heading: copy.aboutHelmetHeading, paragraphs: copy.aboutHelmetParagraphs },
          {
            heading: copy.aboutAngloSaxonsHeading,
            paragraphs: copy.aboutAngloSaxonsParagraphs,
          },
        ]}
      />
      <Footer />
    </>
  )
}
