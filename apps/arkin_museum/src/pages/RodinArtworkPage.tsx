import { Fragment, useEffect, useLayoutEffect, useMemo, useRef } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { getRodinAudio } from "../assets/Audio/rodinAudio"
import { RODIN_IMAGE_GALLERIES, RODIN_IMAGES } from "../assets/rodin"
import ArtworkImageGallery from "../components/ArtworkImageGallery"
import AudioPlayer from "../components/AudioPlayer"
import Footer from "../components/Footer"
import {
  getRodinArtwork,
  type RodinArtwork,
  type RodinArtworkMeta,
  type RodinArtworkSource,
} from "../data/rodinArtworks"
import NotFoundPage from "./NotFoundPage"
import { detectArtworkLocale, resolveArtworkCopy } from "../utils/artworkLocale"
import { getArtworkDisplayTitle, getArtworkPageTitle } from "../utils/artworkTitles"
import "../styles/style.css"
import "../styles/rodin-exhibition.css"

function ArtworkHeading({ artwork }: { artwork: RodinArtwork }) {
  const { french, english } = getArtworkDisplayTitle(artwork)

  return (
    <h1 className="arkin-exhibition-title">
      <span className="arkin-exhibition-title-main">{french}</span>
      {english ? <span className="arkin-exhibition-title-alt">({english})</span> : null}
    </h1>
  )
}

function ConceivedLine({ text }: { text: string }) {
  const lineRef = useRef<HTMLParagraphElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const line = lineRef.current
    const textEl = textRef.current
    if (!line || !textEl) return

    const fit = () => {
      textEl.style.fontSize = ""
      textEl.style.transform = ""
      line.style.minHeight = ""
      const maxSize = window.matchMedia("(max-width: 520px)").matches ? 12.5 : 13.5
      textEl.style.fontSize = `${maxSize}px`

      const available = line.clientWidth
      const needed = textEl.scrollWidth
      if (needed > available && available > 0) {
        const scale = available / needed
        textEl.style.transform = `scale(${scale})`
        textEl.style.transformOrigin = "center top"
        line.style.minHeight = `${textEl.getBoundingClientRect().height * scale}px`
      }
    }

    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [text])

  return (
    <p ref={lineRef} className="arkin-exhibition-details-line arkin-exhibition-details-line--conceived">
      <span ref={textRef} className="arkin-exhibition-details-conceived-text">
        {text}
      </span>
    </p>
  )
}

function ExhibitionDetails({ artwork }: { artwork: RodinArtwork }) {
  const conceived = artwork.caption
  const size = artwork.meta?.height
  const material = artwork.meta?.materials
  const location = artwork.meta?.location
  const hasSpecs = Boolean(size || material)

  if (!conceived && !hasSpecs && !location) return null

  return (
    <div className="arkin-exhibition-details">
      {conceived ? <ConceivedLine text={conceived} /> : null}
      {hasSpecs ? (
        <p className="arkin-exhibition-details-line arkin-exhibition-details-line--specs">
          {size ? <span className="arkin-exhibition-details-spec">{size}</span> : null}
          {size && material ? (
            <span className="arkin-exhibition-details-sep" aria-hidden="true">
              ·
            </span>
          ) : null}
          {material ? <span className="arkin-exhibition-details-spec">{material}</span> : null}
        </p>
      ) : null}
      {location ? (
        <p className="arkin-exhibition-details-line arkin-exhibition-details-line--location">{location}</p>
      ) : null}
    </div>
  )
}

function ExhibitionPlateCaption({
  artwork,
  plateCaption,
}: {
  artwork: RodinArtwork
  plateCaption: string | null
}) {
  if (plateCaption) {
    return <figcaption className="arkin-exhibition-plate-caption">{plateCaption}</figcaption>
  }

  const meta = artwork.meta
  if (!meta?.marksAndInscriptions && !meta?.inventoryNumber) return null

  const parts = [
    meta.marksAndInscriptions,
    meta.inventoryNumber ? `Inventory ${meta.inventoryNumber}` : null,
  ].filter(Boolean)

  return (
    <figcaption className="arkin-exhibition-plate-caption">
      {artwork.artist}, <em>{artwork.title}</em>. {parts.join(" ")}
    </figcaption>
  )
}

function ExhibitionSources({
  sources,
  sourcesLabel,
}: {
  sources: RodinArtworkSource[]
  sourcesLabel: string
}) {
  if (sources.length === 0) return null

  return (
    <footer className="arkin-exhibition-sources" aria-label="Sources">
      <span className="arkin-exhibition-sources-label">{sourcesLabel}</span>{" "}
      {sources.map((source, index) => (
        <Fragment key={source.href}>
          {index > 0 ? <span className="arkin-exhibition-sources-sep" aria-hidden="true"> · </span> : null}
          <a href={source.href} target="_blank" rel="noopener noreferrer">
            {source.label}
          </a>
        </Fragment>
      ))}
    </footer>
  )
}

function ExhibitionEssay({
  paragraphs,
  aboutHeading,
}: {
  paragraphs: string[]
  aboutHeading: string
}) {
  if (paragraphs.length === 0) return null

  return (
    <section className="arkin-exhibition-essay" aria-labelledby="arkin-exhibition-essay-heading">
      <h2 id="arkin-exhibition-essay-heading">{aboutHeading}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </section>
  )
}

export default function RodinArtworkPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const artwork = slug ? getRodinArtwork(slug) : undefined
  const locale = useMemo(() => detectArtworkLocale(searchParams), [searchParams])
  const copy = useMemo(
    () => (artwork ? resolveArtworkCopy(artwork, locale) : undefined),
    [artwork, locale]
  )

  useEffect(() => {
    if (copy) {
      document.title = `${getArtworkPageTitle(copy)} | Take Me Around`
      document.documentElement.lang = copy.locale === "tr" ? "tr" : "en"
    }
  }, [copy])

  if (!artwork || !copy) {
    return <NotFoundPage />
  }

  const exhibition = artwork.exhibitionStyle
  const pageSubtitle = copy.artist
  const displayTitle = getArtworkPageTitle(copy)
  const { french: displayFrench, english: displayEnglish } = getArtworkDisplayTitle(copy)
  const gallery = slug ? RODIN_IMAGE_GALLERIES[slug] : undefined
  const imageSrc = slug ? RODIN_IMAGES[slug] : undefined
  const audioSrc = slug ? getRodinAudio(slug) : undefined
  const aboutParagraphs = copy.aboutParagraphs ?? []
  const hasCustomAbout = aboutParagraphs.length > 0
  const summary =
    copy.summary ?? (aboutParagraphs.length > 1 ? aboutParagraphs[0] : null)
  const essayParagraphs = hasCustomAbout
    ? copy.summary
      ? aboutParagraphs
      : aboutParagraphs.length > 1
        ? aboutParagraphs.slice(1)
        : aboutParagraphs
    : artwork.description
      ? [artwork.description]
      : copy.locale === "tr"
        ? [
            "Bu bronz, Arkın Rodin Koleksiyonu'nun bir parçasıdır. Bu eser hakkında daha fazla bilgi edinmek için yukarıdaki sesli rehberi dinleyin.",
          ]
        : [
            "This bronze is part of the Arkın Rodin Collection. Listen to the audio guide above to discover more about this piece.",
          ]

  if (exhibition) {
    return (
      <main className="arkin-exhibition-page arkin-exhibition-page--artwork">
        <div className="arkin-exhibition-page-inner">
          <header className="arkin-exhibition-label">
            <div className="arkin-exhibition-eyebrow">{copy.exhibitionEyebrow}</div>
            <ArtworkHeading artwork={copy} />
            <p className="arkin-exhibition-byline">{copy.artist}</p>
            <ExhibitionDetails artwork={copy} />
            {summary ? <p className="arkin-exhibition-summary">{summary}</p> : null}
          </header>

          {audioSrc ? <AudioPlayer src={audioSrc} /> : null}

          <figure className="arkin-exhibition-plate">
            <div className="arkin-exhibition-frame">
              {gallery && gallery.length > 0 ? (
                <ArtworkImageGallery images={gallery} title={displayTitle} />
              ) : imageSrc ? (
                <img src={imageSrc} alt={displayTitle} className="arkin-exhibition-plate-image" />
              ) : (
                <div
                  className="arkin-exhibition-plate-image arkin-exhibition-plate-placeholder"
                  role="img"
                  aria-label={displayTitle}
                />
              )}
            </div>
            <ExhibitionPlateCaption artwork={copy} plateCaption={copy.plateCaption} />
          </figure>

          <ExhibitionEssay paragraphs={essayParagraphs} aboutHeading={copy.aboutHeading} />

          {copy.sources?.length ? (
            <ExhibitionSources sources={copy.sources} sourcesLabel={copy.sourcesLabel} />
          ) : null}
        </div>

        <Footer variant="artwork" />
      </main>
    )
  }

  return (
    <>
      <main className="tma-gallery-page">
        <header className="tma-header">
          <div className="tma-header-inner">
            <h1 className="tma-page-title">{displayFrench}</h1>
            {displayEnglish ? <p className="tma-page-subtitle">({displayEnglish})</p> : null}
            <p className="tma-page-subtitle">{pageSubtitle}</p>
          </div>
        </header>

        <div className="tma-content">
          {audioSrc ? <AudioPlayer src={audioSrc} /> : null}
          {gallery && gallery.length > 0 ? (
            <ArtworkImageGallery images={gallery} title={copy.title} />
          ) : imageSrc ? (
            <img src={imageSrc} alt={copy.title} className="tma-painting-image" />
          ) : (
            <div
              className="tma-painting-image tma-sculpture-placeholder"
              role="img"
              aria-label={copy.title}
            />
          )}

          {copy.meta ? <LegacyMeta meta={copy.meta} locale={copy.locale} /> : null}

          <h2>
            {copy.locale === "tr" ? `${copy.title} hakkında` : `About ${copy.title}.`}
          </h2>
          {hasCustomAbout ? (
            aboutParagraphs.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)
          ) : (
            <>
              {artwork.description ? <p>{artwork.description}</p> : null}
              <p>
                {copy.locale === "tr"
                  ? "Bu bronz, Auguste Rodin (1840–1917) ve ilgili heykeltıraşların eserlerini içeren Arkın Rodin Koleksiyonu'nun bir parçasıdır."
                  : "This bronze is part of the Arkın Rodin Collection, featuring works by Auguste Rodin (1840–1917) and related sculptors."}
              </p>
            </>
          )}
        </div>

        <a href="/underlying-technology" className="tma-banner-link">
          <p className="tma-banner-text">
            <strong>Click this banner to discover more about technology used to create this page.</strong>
          </p>
        </a>
      </main>
      <Footer variant="artwork" />
    </>
  )
}

function LegacyMeta({ meta, locale }: { meta: RodinArtworkMeta; locale: "en" | "tr" }) {
  const labels =
    locale === "tr"
      ? {
          height: "Yükseklik",
          marks: "İşaretler ve Yazılar",
          inventory: "Envanter Numarası",
          materials: "Malzemeler",
          location: "Konum",
        }
      : {
          height: "Height",
          marks: "Marks & Inscriptions",
          inventory: "Inventory Number",
          materials: "Materials",
          location: "Location",
        }

  return (
    <dl className="tma-artwork-meta">
      {meta.height ? (
        <>
          <dt>{labels.height}</dt>
          <dd>{meta.height}</dd>
        </>
      ) : null}
      {meta.marksAndInscriptions ? (
        <>
          <dt>{labels.marks}</dt>
          <dd>{meta.marksAndInscriptions}</dd>
        </>
      ) : null}
      {meta.inventoryNumber ? (
        <>
          <dt>{labels.inventory}</dt>
          <dd>{meta.inventoryNumber}</dd>
        </>
      ) : null}
      {meta.materials ? (
        <>
          <dt>{labels.materials}</dt>
          <dd>{meta.materials}</dd>
        </>
      ) : null}
      {meta.location ? (
        <>
          <dt>{labels.location}</dt>
          <dd>{meta.location}</dd>
        </>
      ) : null}
    </dl>
  )
}
