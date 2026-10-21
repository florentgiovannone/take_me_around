import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/museum"
import { detectHoaLocale, resolveHoaCopy } from "../utils/hoaHakananaiLocale"

const ARTWORK_SLUG = "hoa-hakananai"

export default function HoaHakananaiPage() {
  const [searchParams] = useSearchParams()
  const locale = detectHoaLocale(searchParams)
  const copy = resolveHoaCopy(locale)
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
          { heading: copy.aboutHoaHeading, paragraphs: copy.aboutHoaParagraphs },
          { heading: copy.aboutRapaNuiHeading, paragraphs: copy.aboutRapaNuiParagraphs },
        ]}
      />
      <Footer />
    </>
  )
}
