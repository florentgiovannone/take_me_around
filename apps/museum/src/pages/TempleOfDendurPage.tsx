import { useSearchParams } from "react-router-dom"
import { ArtworkFrame } from "@tma/brand"
import Footer from "../components/Footer"
import SectionAudio from "../components/SectionAudio"
import templeImage from "../assets/museum/images/temple-of-dendur.jpg"
import {
  detectTempleOfDendurLocale,
  resolveTempleOfDendurCopy,
} from "../utils/templeOfDendurLocale"
import "../styles/style.css"

const WORK_SLUG = "the-temple-of-dendur"

export default function TempleOfDendurPage() {
  const [searchParams] = useSearchParams()
  const locale = detectTempleOfDendurLocale(searchParams)
  const copy = resolveTempleOfDendurCopy(locale)
  const looking = copy.sections.find((section) => section.visitLabel && section.visitBody)

  return (
    <>
      <ArtworkFrame
        title={copy.title}
        subtitle={copy.subtitle}
        bannerTop={copy.banner}
        bannerBottom={copy.banner}
        imageSrc={templeImage}
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
              ...(section.motifs ?? []).map((motif) => {
                const label = /[.!?…]$/.test(motif.label.trim())
                  ? motif.label
                  : `${motif.label}.`
                return `${label} ${motif.text}`
              }),
              ...(section.afterNote ? [section.afterNote] : []),
            ],
          })),
          ...(looking
            ? [{ heading: looking.visitLabel ?? "", paragraphs: [looking.visitBody ?? ""] }]
            : []),
          { heading: copy.colophonLeft, paragraphs: [copy.colophonRight] },
        ]}
      />
      <Footer />
    </>
  )
}
