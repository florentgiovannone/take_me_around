import portrait from "./assets/diane-hartley.jpg"

const sections = [
  {
    id: "economy",
    title: "Economy & Cost of Living",
    points: [
      "Freeze council tax for three years for owner-occupiers on below-median incomes",
      "Push for a national energy price cap anchored to actual production costs, not wholesale market speculation",
      "Oppose any further rises to National Insurance contributions for employees earning under £35,000",
      "Back a living wage uplift tied to regional cost-of-living indices, not a single national figure",
    ],
  },
  {
    id: "nhs",
    title: "NHS & Social Care",
    points: [
      "Demand the return of walk-in GP appointments within a 20-minute travel radius — an end to the phone-only triage system",
      "Ringfence NHS recruitment budgets so that local training pipelines (Wigan and Leigh College, local NHS trusts) are funded before agency contracts are renewed",
      "Legislate a social care cap so no home-owning family loses their property to care costs",
    ],
  },
  {
    id: "housing",
    title: "Housing & Community",
    points: [
      "Protect the green buffer land between Makerfield’s towns from speculative development",
      "Compulsory purchase powers for long-term empty homes: refurbish and sell to local first-time buyers at assessed value",
      "Oppose further out-of-town retail parks that hollow out Ashton and Hindley town centres",
    ],
  },
  {
    id: "crime",
    title: "Crime & Safety",
    points: [
      "Restore neighbourhood policing with at least one named, publicly accessible officer per ward — contact details published and kept current on the council website",
      "Mandatory minimum sentences for knife crime offences — no judicial discretion below the threshold",
      "CCTV infrastructure grants for town centres funded by redirecting the Community Infrastructure Levy",
    ],
  },
  {
    id: "education",
    title: "Education & Skills",
    points: [
      "Reinstate BTec Level 3 routes alongside A-levels — academic pathways are not the only measure of a community’s worth",
      "Apprenticeship levy reform: smaller local employers must be able to access funds currently absorbed by large national contractors",
      "Free school meals extended to all primary-age children in households below 130% of median income",
    ],
  },
  {
    id: "immigration",
    title: "Immigration",
    points: [
      "Annual immigration quotas set by Parliament and legally enforced — not left to departmental discretion or ignored when inconvenient",
      "A clear, published points-based system with no exceptions for government contractors or preferred sectors",
      "Asylum decisions completed within six months; those refused must be returned promptly",
    ],
  },
  {
    id: "democracy",
    title: "Democracy & Accountability",
    points: [
      "Term limits of three terms (15 years maximum) for all MPs — no more career parliamentarians",
      "Citizens’ assemblies with binding referenda rights on major local infrastructure decisions",
      "Full public register of MPs’ second incomes with real-time disclosure, not annual returns",
    ],
  },
  {
    id: "values",
    title: "Values",
    points: [
      "Controlled, managed immigration — annual quotas set and enforced by Parliament, not departmental discretion",
      "Defence of the parish council and local civic structures against amalgamation into regional super-bodies",
      "Recognition that Makerfield’s identity — its mining heritage, its chapels, its terraces — is worth preserving, not managed into obsolescence",
    ],
  },
]

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Fair Future Party · Makerfield By-Election</p>
          <h1>Fair Deal. Real Voice. Your Makerfield.</h1>
          <p className="candidate">Diane Hartley | Candidate for Makerfield</p>
        </div>
        <figure className="portrait">
          <img
            src={portrait}
            alt="Diane Hartley, Fair Future Party candidate for Makerfield"
          />
        </figure>
      </header>

      <section className="bio" aria-labelledby="bio-heading">
        <h2 id="bio-heading" className="visually-hidden">
          About Diane Hartley
        </h2>
        <p>
          Diane Hartley, 54, was born and raised in Ashton-in-Makerfield. She
          spent 22 years as an NHS district nurse before retraining as a
          secondary school PSHE teacher. A homeowner, parish councillor, food
          bank volunteer, and mother of two adult children, Diane has no prior
          political career — only a lifetime of service to this community.
        </p>
      </section>

      <section className="film" aria-labelledby="film-heading">
        <h2 id="film-heading">Hear from Diane</h2>
        <video
          className="film-video"
          controls
          playsInline
          preload="metadata"
          poster="/diane-hartley-poster.jpg"
          src="/diane-hartley.mp4"
        >
          Your browser does not support this video.
        </video>
      </section>

      <nav className="contents" aria-label="Manifesto sections">
        {sections.map((section, index) => (
          <a key={section.id} href={`#${section.id}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        ))}
      </nav>

      <main>
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="policy"
            aria-labelledby={`${section.id}-heading`}
          >
            <h2 id={`${section.id}-heading`}>{section.title}</h2>
            <ul>
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="word" aria-labelledby="word-heading">
          <h2 id="word-heading">A Word from Diane</h2>
          <blockquote>
            <p>
              I have not been a career politician. I am a nurse who taught, a
              neighbour who volunteers, and someone who has watched this place
              be talked about rather than listened to for far too long. If you
              send me to Westminster, I will say what I see and vote what I
              believe — nothing more, nothing less.
            </p>
          </blockquote>
        </section>
      </main>

      <footer className="imprint">
        <p className="contact">
          <a href="mailto:hello@fairfuturemakerfield.org.uk">
            hello@fairfuturemakerfield.org.uk
          </a>
          <span aria-hidden="true"> · </span>
          <a href="tel:+441942000111">01942 000 111</a>
        </p>
        <p>Promoted by D. Hartley, Fair Future Party, Makerfield</p>
        <p>
          Diane Hartley is a fictional candidate created for illustrative
          purposes. The Fair Future Party does not exist.
        </p>
      </footer>
    </div>
  )
}
