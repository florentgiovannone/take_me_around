import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/gallery"
import {
  detectFallenMadonnaLocale,
  resolveFallenMadonnaCopy,
} from "../utils/fallenMadonnaLocale"

const ARTWORK_SLUG = "fallen-madonna"

export default function GalleryNouvionPage() {
  const [searchParams] = useSearchParams()
  const locale = detectFallenMadonnaLocale(searchParams)
  const copy = resolveFallenMadonnaCopy(locale)
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
