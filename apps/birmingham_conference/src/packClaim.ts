import { REGISTRATION_UNAVAILABLE } from "./registrationFlow"
import { registrationForPack, type ConfirmedRegistration } from "./scanRegistrations"

export const PACK_CLAIM_INTRO =
  "To view the whole experience, please enter your email address, name, and organisation name. We will send you an email to confirm your email address. You will enjoy permanent access to the full content. Thank you for your interest."

export const PACK_ALREADY_REGISTERED = "This pack number is already registered."

export const PACK_CLAIM_SUBMIT = "View the full experience"

export const PACK_CLAIM_AUDIO_HINT = "To listen to the audio please fill the form below"

export { CONSENT_LABEL as PACK_CLAIM_CONSENT } from "./interestForm"

export type PackClaimArtworkSection = {
  heading: string
  paragraphs: string[]
}

export type PackClaimArtworkTeaser = {
  kind: "artwork"
  title: string
  detail?: string
  subtitle: string
  imageSrc: string
  imageAlt: string
  sections: PackClaimArtworkSection[]
}

export type PackClaimTeaser = { kind: "dashboard" } | PackClaimArtworkTeaser

const ARTWORK_TEASERS: Record<string, Omit<PackClaimArtworkTeaser, "kind">> = {
  "the-star-of-betlehem": {
    title: "The Star of Betlehem",
    subtitle: "1887–1891 by Edward Burne-Jones",
    imageSrc: "/the-star-of-betlehem.jpg",
    imageAlt: "Edward Burne-Jones, The Star of Betlehem, watercolour.",
    sections: [
      {
        heading: "About the work",
        paragraphs: [
          "Edward Burne-Jones painted The Star of Betlehem in watercolour and bodycolour between 1887 and 1891. The Corporation of Birmingham commissioned it in 1887 for the new Museum and Art Gallery, and the gallery purchased it in 1891. It remains in the collection of Birmingham Museums. Painted across ten joined sheets of paper, it is widely described as the largest watercolour of the nineteenth century.",
        ],
      },
      {
        heading: "About the artist",
        paragraphs: [
          "Edward Burne-Jones was born in Birmingham on 28 August 1833 and died in London on 17 June 1898. He was christened Edward Coley Burne Jones and later wrote the surname as Burne-Jones. From King Edward’s School he went to Exeter College, Oxford, meaning to enter the church, and there he met William Morris. Dante Gabriel Rossetti turned him towards painting. He spent the rest of his life on myth, legend, and biblical subjects, and he became a central figure of the later Pre-Raphaelite circle.",
        ],
      },
    ],
  },
  "the-golden-boys": {
    title: "The Golden Boys",
    detail: "Boulton, Watt and Murdoch",
    subtitle: "1956 by William Bloye",
    imageSrc: "/the-golden-boys.jpg",
    imageAlt: "Gilded bronze group of Boulton, Watt and Murdoch by William Bloye.",
    sections: [
      {
        heading: "About the work",
        paragraphs: [
          "The Golden Boys is the name Birmingham uses for the gilded bronze group of Matthew Boulton, James Watt, and William Murdoch. Its formal title is Boulton, Watt and Murdoch. The three figures, larger than life, stand together over a partly rolled drawing of a steam engine. That sheet has also earned the group another nickname, The Carpet Salesmen.",
        ],
      },
      {
        heading: "About the artist",
        paragraphs: [
          "William Bloye (1890–1975) spent his career as Birmingham’s civic sculptor. He trained at the Birmingham School of Art and at the Royal Academy Schools, then returned to the School of Art in 1919 and led its sculpture teaching until he retired in 1956, the year this group was unveiled. In the early 1920s he studied stone carving and lettering with Eric Gill, and that clarity stayed in his reliefs.",
        ],
      },
    ],
  },
}

export function packClaimTeaser(args: {
  kind: "artwork" | "dashboard"
  artworkSlug: string
  artworkTitle: string
}): PackClaimTeaser {
  if (args.kind !== "artwork") return { kind: "dashboard" }
  const teaser = ARTWORK_TEASERS[args.artworkSlug]
  if (!teaser) return { kind: "dashboard" }
  return { kind: "artwork", ...teaser }
}

export type PackClaimForm = {
  name: string
  surname: string
  email: string
  company: string
  consent: boolean
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LIMITS = { name: 100, surname: 100, email: 254, company: 200 } as const
const BLANK = {
  name: "Enter your name.",
  surname: "Enter your surname.",
  email: "Enter a valid email.",
  company: "Enter your company.",
} as const

export function submitPackClaim(
  values: PackClaimForm
): { ok: true } | { ok: false; errors: Partial<Record<keyof PackClaimForm, string>> } {
  const errors: Partial<Record<keyof PackClaimForm, string>> = {}
  for (const field of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    const text = values[field].trim()
    const limit = LIMITS[field]
    if (text.length > limit) {
      errors[field] = `Use ${limit} characters or fewer.`
      continue
    }
    if (field === "email") {
      if (!EMAIL.test(text)) errors.email = BLANK.email
      continue
    }
    if (!text) errors[field] = BLANK[field]
  }
  if (values.consent !== true) errors.consent = "Confirm that we may store these details."
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true }
}

export function viewFromPackLookup(args: {
  cancelled: boolean
  ok: boolean
  rows: ConfirmedRegistration[]
  packNumber: string
}): { claimed: boolean; notice: string } | null {
  if (args.cancelled) return null
  if (!args.ok) return { claimed: false, notice: REGISTRATION_UNAVAILABLE }
  return {
    claimed: Boolean(registrationForPack(args.rows, args.packNumber)),
    notice: "",
  }
}

export function viewAfterPackTaken(args: {
  ok: boolean
  rows: ConfirmedRegistration[]
  packNumber: string
}): { redirect: true } | { redirect: false; notice: string } {
  if (args.ok && registrationForPack(args.rows, args.packNumber)) return { redirect: true }
  return { redirect: false, notice: PACK_ALREADY_REGISTERED }
}

export function packClaimPayload(values: PackClaimForm, tagCode: string) {
  return {
    tagCode,
    name: values.name.trim(),
    surname: values.surname.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    consent: values.consent,
  }
}
