import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import { GOLDEN_BOYS } from "../data/goldenBoys"
import "../styles/style.css"

export default function GoldenBoysPage() {
  const copy = GOLDEN_BOYS
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
        sections={[
          { heading: copy.aboutWorkHeading, paragraphs: copy.aboutWorkParagraphs },
          { heading: copy.aboutArtistHeading, paragraphs: copy.aboutArtistParagraphs },
        ]}
      />
      <Footer />
    </>
  )
}