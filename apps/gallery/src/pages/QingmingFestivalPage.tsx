import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { ARTWORK_IMAGES, getArtworkAudio } from "../assets/gallery"
import {
  detectQingmingFestivalLocale,
  resolveQingmingFestivalCopy,
} from "../utils/qingmingFestivalLocale"

const ARTWORK_SLUG = "qingming-festival"

export default function QingmingFestivalPage() {
  const [searchParams] = useSearchParams()
  const locale = detectQingmingFestivalLocale(searchParams)
  const copy = resolveQingmingFestivalCopy(locale)
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
