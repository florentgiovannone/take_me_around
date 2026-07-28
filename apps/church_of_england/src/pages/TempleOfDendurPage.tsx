import Footer from "../components/Footer"
import AudioPlayer from "../components/AudioPlayer"
import { getStopAudio } from "../assets/church-of-england"
import templeImage from "../assets/church-of-england/images/temple-of-dendur/temple-of-dendur.jpg"
import "../styles/style.css"
import "../styles/temple-of-dendur.css"

const STOP_SLUG = "the-temple-of-dendur"
const BANNER = "Learn how this experience works"

export default function TempleOfDendurPage() {
  const audioSrc = getStopAudio(STOP_SLUG)

  return (
    <>
      <a href="/underlying-technology" className="tma-banner-link">
        <p className="tma-banner-text">
          <strong>{BANNER}</strong>
        </p>
      </a>
      {audioSrc ? <AudioPlayer src={audioSrc} /> : null}

      <div className="temple-of-dendur">
        <article className="page">
          <div className="eyebrow">
            The Met Fifth Avenue <span className="dot">◆</span> Egyptian Art{" "}
            <span className="dot">◆</span> Gallery 131
          </div>

          <h1>The Temple of Dendur</h1>
          <div className="subtitle">
            A Nubian temple for Isis, gifted by Egypt to the American people
          </div>

          <div className="rule" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M2 20h20M4 20V9l8-5 8 5v11M8 20v-7h8v7M11 4V2h2v2" />
            </svg>
          </div>

          <figure className="plate">
            <div className="frame">
              <img
                src={templeImage}
                alt="The Temple of Dendur reassembled in Gallery 131 of The Metropolitan Museum of Art"
              />
            </div>
            <figcaption>
              <span>
                The temple and its gate, reassembled beside a reflecting pool in the glazed
                north wing.
              </span>
              <span className="credit">
                Image: The Metropolitan Museum of Art, Object No. 68.154
              </span>
            </figcaption>
          </figure>

          <div className="facts">
            <div>
              <span className="k">Date</span>
              <span className="v">completed by 10 BC</span>
            </div>
            <div>
              <span className="k">Reign</span>
              <span className="v">Caesar Augustus</span>
            </div>
            <div>
              <span className="k">From</span>
              <span className="v">Dendur, Lower Nubia</span>
            </div>
            <div>
              <span className="k">Material</span>
              <span className="v">Aeolian sandstone</span>
            </div>
            <div>
              <span className="k">Temple</span>
              <span className="v">6.4 × 6.4 × 12.5 m</span>
            </div>
            <div>
              <span className="k">Gate</span>
              <span className="v">8.1 × 3.7 × 3.4 m</span>
            </div>
            <div>
              <span className="k">Acquired</span>
              <span className="v">Gift of Egypt, 1965</span>
            </div>
            <div>
              <span className="k">On view since</span>
              <span className="v">1978, Gallery 131</span>
            </div>
          </div>

          <div className="essay">
            <p className="lede">
              The Temple of Dendur is the only complete Egyptian temple in the Western
              Hemisphere. Built on the west bank of the Nile in Lower Nubia around 15 BC, it
              was commissioned by the first Roman emperor of Egypt, Augustus, and dedicated to
              the goddess Isis and to two local heroes — brothers named Pediese and Pihor —
              who were revered as demigods after drowning in the river.
            </p>

            <h2>A political temple in a Roman province</h2>
            <p>
              After Augustus defeated Cleopatra VII and Mark Antony in 31 BC, he confiscated
              the property of Egypt&apos;s temples and centralised their administration. To
              smooth the change of regime he commissioned at least seventeen building projects
              for regional gods; the small sandstone shrine at Tutzis, today known as Dendur,
              was one of them. On its walls Augustus appears as pharaoh in traditional Egyptian
              regalia, making offerings to the gods — a piece of imperial theatre aimed at
              Nubian subjects who still worshipped in the old way.
            </p>

            <h2>Reading the walls</h2>
            <p>
              Egyptian temples were understood as images of the natural world: the sanctuary
              was the primeval mound, the columns the reeds and lotuses of the Nile marshes,
              the ceiling the sky. Dendur&apos;s decoration follows that programme almost as an
              illustrated cosmology.
            </p>
            <ul className="motifs">
              <li>
                <strong>Base of the temple.</strong> Papyrus and lotus plants seem to grow out
                of water represented by figures of Hapy, god of the Nile flood.
              </li>
              <li>
                <strong>Porch columns.</strong> Rise like tall bundles of papyrus stalks bound
                with lotus blossoms.
              </li>
              <li>
                <strong>Gate lintel.</strong> A sun disk flanked by the outspread wings of
                Horus, the sky god.
              </li>
              <li>
                <strong>Porch ceiling.</strong> Vultures with outspread wings stand in for the
                vault of heaven.
              </li>
              <li>
                <strong>Outer walls.</strong> Two horizontal registers of sunk relief show the
                king offering to deities who hold sceptres and the ankh, the sign of life.
              </li>
              <li>
                <strong>Sanctuary back wall.</strong> Pihor worships Isis; below, Pediese —
                now damaged — worships Osiris. This is the ritual heart of the building.
              </li>
            </ul>
            <p className="small">
              Look for the cartouches beside the king&apos;s head. Many are simply inscribed
              “pharaoh” rather than a personal name — a shortcut the Roman-era masons could
              reuse whoever sat on the throne.
            </p>

            <h2>Rescued from the Nile</h2>
            <p>
              When Egypt began building the Aswan High Dam in the 1960s, a vast artificial lake
              — Lake Nasser — was set to swallow dozens of ancient monuments. UNESCO led an
              international rescue and the United States contributed substantial funds. In
              gratitude Egypt presented four of the salvaged monuments to countries that had
              helped; the Temple of Dendur was given to the American people in 1965 and awarded
              to the Metropolitan Museum in 1967 after a national competition.
            </p>
            <p>
              The temple arrived in some 640 crates weighing more than 800 tonnes. It was
              reassembled block by block inside the purpose-built north wing, which opened in
              1978. The glazed north wall faces a reflecting pool that stands in for the Nile,
              and the light shifts through the day much as it once did at Dendur.
            </p>

            <h2>Looking closely</h2>
            <p>
              Approach from the gate first, so you enter the temple as an ancient worshipper
              would have. Inside you pass through three spaces of increasing sanctity: a
              pronaos with two columns; an offering room whose reliefs are cut in raised rather
              than sunk relief; and, at the back, the small sanctuary of Isis. On the exterior
              look for Greek and Coptic graffiti — pilgrims&apos; names cut into the stone
              across nearly two millennia, including a demotic dedication by a
              nineteenth-century traveller. They are part of the object&apos;s history now.
            </p>

            <div className="visit">
              <strong>Finding it.</strong> Gallery 131, on the ground floor at the north end of
              the Museum. Enter from the Great Hall, walk through the Egyptian galleries in
              chronological order (Old Kingdom → Middle → New → Late Period → Ptolemaic) and
              Dendur is the culmination. Allow twenty minutes; more if the light is good.
            </div>
          </div>

          <footer className="colophon">
            <span>The Metropolitan Museum of Art · 1000 Fifth Avenue, New York</span>
            <span>Object No. 68.154 · Egyptian Art</span>
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
