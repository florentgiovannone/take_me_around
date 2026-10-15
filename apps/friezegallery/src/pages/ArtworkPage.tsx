import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { logArtworkScan } from "../artworkScans"
import { artworkBySlug } from "../artworks"
import ArtworkFigure from "../components/ArtworkFigure"
import AudioPlayer from "../components/AudioPlayer"
import BidButton, { currencyForPrice } from "../components/BidButton"
import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"
import { artworkAudioSrc } from "../audioScript"
import { localizeArtwork } from "../i18n/artworkCopy"
import { LocaleLink, useLocale, useUiCopy } from "../i18n/locale"
import { fill, formatPrice, priceLabel } from "../i18n/uiCopy"

export default function ArtworkPage() {
  const { slug } = useParams()
  const source = artworkBySlug(slug)
  const locale = useLocale()
  const copy = useUiCopy()
  const artwork = source ? localizeArtwork(source, locale) : undefined

  useEffect(() => {
    if (!source) return
    logArtworkScan(source.textName, `/works/${source.slug}`)
  }, [source])

  return (
    <div className="shell">
      <SiteHeader />
      <main className="article">
        {artwork ? (
          <>
            <p className="kicker">{artwork.kicker}</p>
            <h1>{artwork.title}</h1>
            <p className="byline">{fill(copy.byline, { artist: artwork.artist })}</p>
            <AudioPlayer
              src={artworkAudioSrc(artwork.audioSrc, locale)}
              fallbackSrc={artwork.audioSrc}
              unsupported={copy.audioUnsupported}
            />
            <ArtworkFigure src={artwork.imageSrc} alt={artwork.imageAlt} />
            {artwork.extraImages.length > 0 && (
              <div className="piece-extra">
                {artwork.extraImages.map((image) => (
                  <ArtworkFigure key={image.src} src={image.src} alt={image.alt} />
                ))}
              </div>
            )}
            <p className="caption">
              {fill(copy.caption, {
                artist: artwork.artist,
                title: artwork.title,
                year: artwork.year,
                gallery: artwork.gallery,
              })}
            </p>
            <dl className="details">
              <div>
                <dt>{copy.year}</dt>
                <dd>{artwork.year}</dd>
              </div>
              <div>
                <dt>{copy.medium}</dt>
                <dd>{artwork.medium}</dd>
              </div>
              <div>
                <dt>{copy.dimensions}</dt>
                <dd>{artwork.dimensions}</dd>
              </div>
              <div>
                <dt>{copy.gallery}</dt>
                <dd>
                  <a href={artwork.website}>{artwork.gallery}</a>
                </dd>
              </div>
              {artwork.inventory && (
                <div>
                  <dt>{copy.inventory}</dt>
                  <dd>{artwork.inventory}</dd>
                </div>
              )}
              <div>
                <dt>{copy.section}</dt>
                <dd>{artwork.section}</dd>
              </div>
              <div>
                <dt>{copy.fair}</dt>
                <dd>{artwork.fair}</dd>
              </div>
              {artwork.price && (
                <div>
                  <dt>{priceLabel(artwork.price, copy)}</dt>
                  <dd>{formatPrice(artwork.price, copy)}</dd>
                </div>
              )}
              <div>
                <dt>{copy.status}</dt>
                <dd>{artwork.onView ? `${artwork.status} · ${copy.onView}` : artwork.status}</dd>
              </div>
              {artwork.document && (
                <div>
                  <dt>{copy.document}</dt>
                  <dd>
                    <a href={artwork.document.href}>{artwork.document.label}</a>
                  </dd>
                </div>
              )}
            </dl>
            <div className="bid">
              <BidButton key={artwork.slug} originalCurrency={currencyForPrice(artwork.price)} />
            </div>
            <div className="essay">
              <h2>{copy.aboutTheWork}</h2>
              {artwork.standfirst ? <p className="standfirst">{artwork.standfirst}</p> : null}
              {artwork.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1>{copy.workNotOnView}</h1>
            <p>
              <LocaleLink to="/allpages">{copy.seeAllPages}</LocaleLink>
            </p>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
