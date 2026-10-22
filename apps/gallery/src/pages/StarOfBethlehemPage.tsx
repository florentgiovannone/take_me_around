import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import { STAR_OF_BETHLEHEM } from "../data/starOfBethlehem"
import "../styles/style.css"

export default function StarOfBethlehemPage() {
  const copy = STAR_OF_BETHLEHEM
  return (
    <>
      <ArtworkFrame
        title={copy.title}
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
