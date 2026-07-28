import Footer from "../components/Footer"
import AudioPlayer from "../components/AudioPlayer"
import { getStopAudio } from "../assets/church-of-england"
import kissImage from "../assets/church-of-england/images/the-kiss/the-kiss.jpg"
import "../styles/style.css"
import "../styles/the-kiss.css"

const STOP_SLUG = "the-kiss"
const BANNER = "Learn how this experience works"

export default function TheKissPage() {
  const audioSrc = getStopAudio(STOP_SLUG)

  return (
    <>
      <a href="/underlying-technology" className="tma-banner-link">
        <p className="tma-banner-text">
          <strong>{BANNER}</strong>
        </p>
      </a>
      {audioSrc ? <AudioPlayer src={audioSrc} /> : null}

      <div className="the-kiss">
        <article className="page">
          <div className="eyebrow">
            Belvedere, Vienna <span className="dot">✦</span> Upper Belvedere{" "}
            <span className="dot">✦</span> Vienna 1900
          </div>

          <h1>
            The Kiss <em>(Lovers)</em>
          </h1>
          <div className="subtitle">
            Gustav Klimt · the summit of the Golden Period, 1908/09
          </div>

          <div className="rule" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4 12c3-6 13-6 16 0M4 12c3 6 13 6 16 0" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
            </svg>
          </div>

          <figure className="plate">
            <div className="frame">
              <img
                src={kissImage}
                alt="Gustav Klimt, The Kiss (Lovers), 1908/09, oil and gold leaf on canvas, Belvedere, Vienna"
              />
            </div>
            <figcaption>
              <span>
                Two lovers kneel on a flowering meadow, wrapped in a single mantle of gold; the
                exhibition title was <em>Liebespaar</em>, &quot;Lovers&quot;.
              </span>
              <span className="credit">Belvedere, Vienna · Inv. no. 912</span>
            </figcaption>
          </figure>

          <div className="facts">
            <div>
              <span className="k">Artist</span>
              <span className="v">Gustav Klimt (1862–1918)</span>
            </div>
            <div>
              <span className="k">Date</span>
              <span className="v">1908, completed 1909</span>
            </div>
            <div>
              <span className="k">Medium</span>
              <span className="v">Oil, gold &amp; silver leaf on canvas</span>
            </div>
            <div>
              <span className="k">Size</span>
              <span className="v">180 × 180 cm (square)</span>
            </div>
            <div>
              <span className="k">Inv. no.</span>
              <span className="v">Belvedere 912</span>
            </div>
            <div>
              <span className="k">First shown</span>
              <span className="v">Kunstschau, Vienna, 1908</span>
            </div>
            <div>
              <span className="k">Acquired</span>
              <span className="v">Moderne Galerie, 1908 · 25,000 crowns</span>
            </div>
            <div>
              <span className="k">On view</span>
              <span className="v">Upper Belvedere, Klimt gallery</span>
            </div>
          </div>

          <div className="essay">
            <p className="lede">
              Kneeling on a small meadow of wildflowers, at the edge of what looks like a cliff,
              two lovers are wrapped in a single golden mantle. The man leans in; the woman tilts
              her face up to be kissed, her eyes closed, her hand curled around his. Behind them
              there is no room and no landscape — only a shimmering field of gold. The Kiss is the
              most famous painting of the Vienna 1900 moment, and one of the very few pictures in
              the history of Western art that manages to be at once wildly ornamental and
              genuinely tender.
            </p>

            <h2>Klimt&apos;s Golden Period</h2>
            <p>
              By 1907 Gustav Klimt was Vienna&apos;s most celebrated — and most contested —
              painter. His allegorical ceilings for the University had been rejected as obscene,
              he had co‑founded and then walked out of the Secession, and he was living with his
              companion Emilie Flöge above his suburban garden studio. Two experiences pushed him
              toward gold. First, a trip in 1903 to Ravenna, where the Byzantine mosaics of San
              Vitale — Justinian and Theodora against a wall of shimmering gold — showed him a way
              to detach figures from space and turn them into icons. Second, his father&apos;s
              trade: Ernst Klimt had been a gold engraver. Between 1903 and 1909 Klimt built up a
              series of &quot;gold pictures&quot; — the <em>Beethoven Frieze</em>,{" "}
              <em>Judith I</em>, the <em>Portrait of Adele Bloch‑Bauer I</em>, and finally{" "}
              <em>The Kiss</em> — laying real gold and silver leaf directly onto the canvas.
            </p>

            <h2>Reading the picture</h2>
            <p>
              The composition is stricter than it first looks. The lovers form a single golden
              shape — a rounded, phallic silhouette — that stands on a narrow ledge of flowers and
              floats against a matte gold ground. Only the visible skin (his neck, her face, arms
              and feet) and the meadow are painted illusionistically; the rest is ornament. Klimt
              divides that ornament sharply along gendered lines, an idea he had been working out
              since the <em>Beethoven Frieze</em>.
            </p>
            <ul className="motifs">
              <li>
                <strong>His robe.</strong> Rectangles and squares in black, white and silver —
                hard, architectural, &quot;masculine&quot;.
              </li>
              <li>
                <strong>Her robe.</strong> Ovals and concentric circles in gold, rose and violet —
                soft, organic, &quot;feminine&quot;.
              </li>
              <li>
                <strong>The meadow.</strong> Real wildflowers — poppies, daisies, ivy — the only
                naturalistic passage in the picture.
              </li>
              <li>
                <strong>The cliff edge.</strong> Her toes curl over a small precipice: ecstasy
                poised on the brink of the void.
              </li>
              <li>
                <strong>Her hand.</strong> The fingers of her right hand grip his; the tendons are
                drawn with anatomical care.
              </li>
              <li>
                <strong>The gold ground.</strong> Not sky, not wall — an icon painter&apos;s
                timeless field, borrowed from Ravenna.
              </li>
            </ul>

            <blockquote>
              &quot;All art is erotic.&quot;
              <cite>— Gustav Klimt, remark to Berta Zuckerkandl, c. 1905</cite>
            </blockquote>

            <h2>The Kunstschau of 1908</h2>
            <p>
              Klimt unveiled the painting at the 1908 Kunstschau in Vienna, a mammoth exhibition
              he had organised with a breakaway group of artists on empty land where the
              Konzerthaus now stands. It hung as the centrepiece of the &quot;Klimt Room&quot;
              under the more discreet title <em>Liebespaar</em> — &quot;Lovers&quot;. The Austrian
              state, through its newly founded Moderne Galerie in the Lower Belvedere, bought the
              picture straight off the wall for 25,000 crowns before it was even finished. It was
              an astonishing price for a contemporary Austrian work, and made the young
              museum&apos;s reputation overnight.
            </p>

            <h2>Looking closely at the Belvedere</h2>
            <p>
              The painting has hung in the Belvedere ever since — since 1953 in the Upper
              Belvedere, where the Vienna 1900 collection is arranged around the Marble Hall on
              the upper floor. It shares its gallery with <em>Judith I</em>, several Attersee
              landscapes and the double portrait of Fritza Riedler; Egon Schiele&apos;s{" "}
              <em>Death and the Maiden</em> is next door. In reproduction the picture always looks
              like paper; in person the gold is real metal — you see it catch the light and turn
              from bronze to lemon as you move sideways. Try to stand about two to three metres
              back so the full square reads as a single shape, then step in to look at the meadow
              and the hands.
            </p>

            <div className="visit">
              <strong>Finding it.</strong> Upper Belvedere (Oberes Belvedere), Prinz‑Eugen‑Straße
              27, 1030 Vienna. Take tram D to <em>Schloss Belvedere</em>. Enter the palace, climb
              the state staircase to the upper floor, cross the Marble Hall and turn into the
              Klimt gallery — <em>The Kiss</em> is on the end wall. Open daily 09:00–18:00
              (Fridays until 21:00). Go first thing or last hour; the room is small and fills
              quickly.
            </div>
          </div>

          <footer className="colophon">
            <span>Österreichische Galerie Belvedere · Prinz‑Eugen‑Straße 27, Vienna</span>
            <span>Inv. no. 912 · Klimt Collection</span>
          </footer>
        </article>
      </div>

      <a href="/underlying-technology" className="tma-banner-link">
        <p className="tma-banner-text">
          <strong>{BANNER}</strong>
        </p>
      </a>
      <Footer />
    </>
  )
}
