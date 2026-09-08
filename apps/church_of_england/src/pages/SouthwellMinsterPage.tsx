import { Fragment, useEffect, type CSSProperties } from "react"
import { useSearchParams } from "react-router-dom"
import RichText from "../components/RichText"
import SectionAudio from "../components/SectionAudio"
import westFront from "../assets/church-of-england/images/southwell/west-front.jpg"
import westWindow from "../assets/church-of-england/images/southwell/west-window.jpg"
import leaves from "../assets/church-of-england/images/southwell/leaves.jpg"
import organ from "../assets/church-of-england/images/southwell/organ.jpg"
import choir from "../assets/church-of-england/images/southwell/choir.jpg"
import {
  detectSouthwellMinsterLocale,
  resolveSouthwellMinsterCopy,
} from "../utils/southwellMinsterLocale"
import "../styles/style.css"
import "../styles/southwell-minster.css"

const WORK_SLUG = "southwell-minster"

/** Drop `welcome-dean.mp4` (or `.webm`) in `assets/.../video/southwell/` to enable the player. */
const welcomeVideoModules = import.meta.glob(
  "../assets/church-of-england/video/southwell/welcome-dean.{mp4,webm}",
  { eager: true, import: "default" },
) as Record<string, string>
const welcomeVideoSrc = Object.values(welcomeVideoModules)[0] ?? null

export default function SouthwellMinsterPage() {
  const [searchParams] = useSearchParams()
  const locale = detectSouthwellMinsterLocale(searchParams)
  const copy = resolveSouthwellMinsterCopy(locale)
  const heroStyle = {
    "--southwell-hero-image": `url(${westFront})`,
  } as CSSProperties

  useEffect(() => {
    document.documentElement.lang = locale
    return () => {
      document.documentElement.lang = "en"
    }
  }, [locale])

  return (
    <div className="southwell-minster">
      <header className="hero" role="banner" style={heroStyle}>
        <div className="hero-inner">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h1>{copy.title}</h1>
          <p className="tagline">{copy.tagline}</p>
          <div className="meta">
            {copy.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="welcome-dean" aria-labelledby="welcome-dean-heading">
        <div className="welcome-dean-inner">
          <p id="welcome-dean-heading" className="welcome-dean-invite">
            {copy.welcome.invite}
          </p>
          {welcomeVideoSrc ? (
            <video
              className="welcome-dean-video"
              controls
              playsInline
              preload="metadata"
              src={welcomeVideoSrc}
            >
              {copy.welcome.videoUnsupported}
            </video>
          ) : (
            <div className="welcome-dean-placeholder" role="img" aria-label={copy.welcome.placeholderLabel}>
              <span className="welcome-dean-placeholder-label">{copy.welcome.placeholderLabel}</span>
            </div>
          )}
          <p className="welcome-dean-attribution">
            <span className="welcome-dean-role">{copy.welcome.role}</span>
            <span className="welcome-dean-name">{copy.welcome.name}</span>
            <span className="welcome-dean-title">{copy.welcome.title}</span>
          </p>
        </div>
      </section>

      <nav className="toc" aria-label="Section navigation">
        <ul>
          {copy.toc.map((item) => (
            <li key={item.href}><a href={item.href}>{item.label}</a></li>
          ))}
        </ul>
      </nav>

      <main>

      <section id="history">
        <div className="section-head">
          <SectionAudio
            workSlug={WORK_SLUG}
            sectionId="history"
            locale={locale}
            showHint
            hint={copy.audioHint}
          />
          <div className="section-title">
            <div className="section-num">{copy.history.num}</div>
            <h2>{copy.history.heading}</h2>
          </div>
        </div>
        <p className="lede">{copy.history.lede}</p>

        <div className="split">
          <div>
            {copy.history.paragraphs.map((paragraph) => (
              <RichText key={paragraph.slice(0, 48)} html={paragraph} />
            ))}
          </div>
          <figure>
            <img src={westWindow} alt={copy.history.figureAlt} />
            <figcaption>{copy.history.figureCaption}</figcaption>
          </figure>
        </div>

        <div className="rule-ornament">✦ ✦ ✦</div>

        <dl className="timeline" aria-label={copy.history.timelineLabel}>
          {copy.history.timeline.map((item) => (
            <Fragment key={item.year}>
              <dt>{item.year}</dt>
              <dd>{item.text}</dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <section id="treasures">
        <div className="section-head">
          <SectionAudio workSlug={WORK_SLUG} sectionId="treasures" locale={locale} showIcon />
          <div className="section-title">
            <div className="section-num">{copy.treasures.num}</div>
            <h2>{copy.treasures.heading}</h2>
          </div>
        </div>
        <p className="lede">{copy.treasures.lede}</p>

        <div className="split">
          <figure>
            <img src={leaves} alt={copy.treasures.figureAlt} />
            <figcaption>{copy.treasures.figureCaption}</figcaption>
          </figure>
          <div>
            <h3>{copy.treasures.leavesHeading}</h3>
            <RichText html={copy.treasures.leavesBody} />
          </div>
        </div>

        <div className="features">
          {copy.treasures.features.map((feature) => (
            <div className="feature" key={feature.heading}>
              <h3>{feature.heading}</h3>
              <RichText html={feature.body} />
            </div>
          ))}
        </div>
      </section>

      <section id="officers">
        <div className="section-head">
          <SectionAudio workSlug={WORK_SLUG} sectionId="officers" locale={locale} showIcon />
          <div className="section-title">
            <div className="section-num">{copy.officers.num}</div>
            <h2>{copy.officers.heading}</h2>
          </div>
        </div>
        <RichText html={copy.officers.lede} className="lede" />

        <div className="officers">
          {copy.officers.people.map((officer) => (
            <div className="officer" key={`${officer.role}-${officer.name}`}>
              <span className="role">{officer.role}</span>
              <span className="name">{officer.name}</span>
            </div>
          ))}
        </div>
        <p style={{marginTop: '22px', fontSize: '.9rem', color: 'var(--ink-soft)'}}>{copy.officers.note}</p>
      </section>

      <section id="music">
        <div className="section-head">
          <SectionAudio workSlug={WORK_SLUG} sectionId="music" locale={locale} showIcon />
          <div className="section-title">
            <div className="section-num">{copy.music.num}</div>
            <h2>{copy.music.heading}</h2>
          </div>
        </div>
        <p className="lede">{copy.music.lede}</p>

        <div className="split">
          <div>
            <h3>{copy.music.songHeading}</h3>
            {copy.music.songParagraphs.map((paragraph) => (
              <RichText key={paragraph.slice(0, 48)} html={paragraph} />
            ))}
          </div>
          <figure>
            <img src={organ} alt={copy.music.figureAlt} />
            <figcaption>{copy.music.figureCaption}</figcaption>
          </figure>
        </div>

        <h3 style={{marginTop: '36px'}}>{copy.music.choirsHeading}</h3>
        <div className="features">
          {copy.music.features.map((feature) => (
            <div className="feature" key={feature.heading}>
              <h3>{feature.heading}</h3>
              <RichText html={feature.body} />
            </div>
          ))}
        </div>

        <h3 style={{marginTop: '36px'}}>{copy.music.organsHeading}</h3>
        <RichText html={copy.music.organsBody} />
      </section>

      <section id="worship">
        <div className="section-head">
          <SectionAudio workSlug={WORK_SLUG} sectionId="worship" locale={locale} showIcon />
          <div className="section-title">
            <div className="section-num">{copy.worship.num}</div>
            <h2>{copy.worship.heading}</h2>
          </div>
        </div>
        <p className="lede">{copy.worship.lede}</p>

        <div className="split">
          <div>
            {copy.worship.paragraphs.map((paragraph) => (
              <RichText key={paragraph.slice(0, 48)} html={paragraph} />
            ))}
          </div>
          <figure>
            <img src={choir} alt={copy.worship.figureAlt} />
            <figcaption>{copy.worship.figureCaption}</figcaption>
          </figure>
        </div>

        <div className="services" style={{marginTop: '28px'}}>
          <div>
            <h3>{copy.worship.weekdayHeading}</h3>
            <table>
              <tbody>
                {copy.worship.weekdayRows.map((row) => (
                  <tr key={row.clock}>
                    <td>{row.clock}</td>
                    <RichText as="td" html={row.detail} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3>{copy.worship.sundayHeading}</h3>
            <table>
              <tbody>
                {copy.worship.sundayRows.map((row) => (
                  <tr key={row.clock}>
                    <td>{row.clock}</td>
                    <RichText as="td" html={row.detail} />
                  </tr>
                ))}
              </tbody>
            </table>
            <RichText html={copy.worship.timesNote} style={{fontSize: '.85rem', marginTop: '12px'}} />
          </div>
        </div>
      </section>

      <section id="visit">
        <div className="section-head">
          <div className="section-title">
            <div className="section-num">{copy.visit.num}</div>
            <h2>{copy.visit.heading}</h2>
          </div>
        </div>
        <p className="lede">{copy.visit.lede}</p>

        <div className="hours">
          {copy.visit.cards.map((card) => (
            <div className="card" key={card.heading}>
              <h3>{card.heading}</h3>
              <dl>
                {card.rows.map((row) => (
                  <Fragment key={`${row.days}-${row.clock}`}>
                    <dt>{row.days}</dt>
                    <dd>{row.clock}</dd>
                  </Fragment>
                ))}
              </dl>
              {card.note ? (
                <p style={{fontSize: '.88rem', marginTop: '10px'}}>{card.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section id="donate">
        <div className="section-head">
          <SectionAudio workSlug={WORK_SLUG} sectionId="donate" locale={locale} showIcon />
          <div className="section-title">
            <div className="section-num">{copy.donate.num}</div>
            <h2>{copy.donate.heading}</h2>
          </div>
        </div>
        <div className="donate-copy">
          {copy.donate.paragraphs.map((paragraph) => (
            <RichText key={paragraph.slice(0, 48)} html={paragraph} />
          ))}
          <p className="donate-cta">
            <a
              className="donate-button"
              href={copy.donate.donateHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.donate.button}
            </a>
          </p>
          <p>{copy.donate.after}</p>
          <p className="donate-close">{copy.donate.close}</p>
        </div>
      </section>

      <section id="projects">
        <div className="section-head">
          <div className="section-title">
            <div className="section-num">{copy.projects.num}</div>
            <h2>{copy.projects.heading}</h2>
          </div>
        </div>
        <p className="lede">{copy.projects.lede}</p>
        <div className="section-placeholder" aria-label={copy.projects.placeholderLabel}>
          <p className="section-placeholder-label">{copy.projects.placeholderLabel}</p>
          <p>{copy.projects.placeholderBody}</p>
        </div>
      </section>

      <section id="contact">
        <div className="section-head">
          <div className="section-title">
            <div className="section-num">{copy.contact.num}</div>
            <h2>{copy.contact.heading}</h2>
          </div>
        </div>

        <div className="contact">
          <div className="contact-card">
            <h3>{copy.contact.minsterHeading}</h3>
            <div className="row">
              <span>{copy.contact.addressLabel}</span>
              <address>
                {copy.contact.addressLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </address>
            </div>
            <div className="row">
              <span>{copy.contact.telephoneLabel}</span>
              <span>
                <a href={`tel:${copy.contact.telephone}`}>{copy.contact.telephoneDisplay}</a>{" "}
                <em style={{fontSize: '.85em'}}>{copy.contact.mainOffice}</em>
              </span>
            </div>
            <div className="row">
              <span>{copy.contact.emailLabel}</span>
              <span><a href={`mailto:${copy.contact.email}`}>{copy.contact.email}</a></span>
            </div>
            <div className="row">
              <span>{copy.contact.websiteLabel}</span>
              <span>
                <a href={copy.contact.websiteUrl} target="_blank" rel="noopener">
                  {copy.contact.websiteDisplay}
                </a>
              </span>
            </div>
            <div className="row">
              <span>{copy.contact.urgentLabel}</span>
              <span><a href={`tel:${copy.contact.urgentTel}`}>{copy.contact.urgentDisplay}</a></span>
            </div>
            <div className="row">
              <span>{copy.contact.shopLabel}</span>
              <span>
                <a href={`tel:${copy.contact.shopTel}`}>{copy.contact.shopTelDisplay}</a>
                {" · "}
                <a href={`mailto:${copy.contact.shopEmail}`}>{copy.contact.shopEmail}</a>
              </span>
            </div>
          </div>

          <div>
            <h3 style={{marginTop: '0'}}>{copy.contact.gettingHereHeading}</h3>
            {copy.contact.gettingHere.map((paragraph) => (
              <RichText key={paragraph.slice(0, 48)} html={paragraph} />
            ))}
            <p style={{fontSize: '.88rem', color: 'var(--ink-soft)'}}>
              {copy.contact.socialPrefix}{" "}
              <a href={copy.contact.facebookUrl} target="_blank" rel="noopener">{copy.contact.facebook}</a>
              {" · "}
              <a href={copy.contact.twitterUrl} target="_blank" rel="noopener">{copy.contact.twitter}</a>
              {" · "}
              <a href={copy.contact.instagramUrl} target="_blank" rel="noopener">{copy.contact.instagram}</a>
            </p>
          </div>
        </div>
      </section>

      </main>

      <footer>
        <div className="colophon">{copy.footer.latinColophon}</div>
        <div>{copy.footer.credit}</div>
        <div style={{marginTop: '8px'}}>{copy.footer.photos}</div>
      </footer>
    </div>
  )
}
