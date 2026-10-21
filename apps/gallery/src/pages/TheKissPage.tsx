import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import SectionAudio from "../components/SectionAudio"
import kissImage from "../assets/gallery/images/the-kiss.jpg"
import { detectTheKissLocale, resolveTheKissCopy } from "../utils/theKissLocale"
import "../styles/style.css"

const WORK_SLUG = "the-kiss"

export default function TheKissPage() {
  const [searchParams] = useSearchParams()
  const locale = detectTheKissLocale(searchParams)
  const copy = resolveTheKissCopy(locale)

  return (
    <>
      <ArtworkFrame
        title={`${copy.title} ${copy.titleEm}`.trim()}
        subtitle={copy.subtitle}
        bannerTop={copy.banner}
        bannerBottom={copy.banner}
        imageSrc={kissImage}
        imageAlt={copy.imageAlt}
        audio={
          <>
            <SectionAudio workSlug={WORK_SLUG} sectionId="intro" locale={locale} />
            {copy.sections.map((section) => (
              <SectionAudio
                key={section.id}
                workSlug={WORK_SLUG}
                sectionId={section.id}
                locale={locale}
              />
            ))}
          </>
        }
        sections={[
          {
            heading: copy.eyebrowParts.join(" · "),
            paragraphs: [
              copy.figcaption,
              copy.credit,
              ...copy.facts.map((fact) => `${fact.k}: ${fact.v}`),
              copy.lede,
            ],
          },
          ...copy.sections.map((section) => ({
            heading: section.heading,
            paragraphs: [
              ...section.paragraphs,
              ...(section.motifs ?? []).map((motif) => `${motif.label} ${motif.text}`),
              ...(section.quote
                ? [`"${section.quote}" ${section.quoteCite ?? ""}`.trim()]
                : []),
              ...(section.visitBody
                ? [`${section.visitLabel ?? ""} ${section.visitBody}`.trim()]
                : []),
            ],
          })),
          { heading: copy.colophonLeft, paragraphs: [copy.colophonRight] },
        ]}
      />
      <Footer />
    </>
  )
}
