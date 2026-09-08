import en from "./southwellMinster.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type SouthwellMinsterLocale = ArtworkPageLocale

export type SouthwellFeature = { heading: string; body: string }
export type SouthwellOfficer = { role: string; name: string }
export type SouthwellTimelineItem = { year: string; text: string }
export type SouthwellTocItem = { href: string; label: string }
export type SouthwellClockRow = { clock: string; detail: string }
export type SouthwellHoursRow = { days: string; clock: string }
export type SouthwellHoursCard = {
  heading: string
  rows: SouthwellHoursRow[]
  note?: string
}

export type SouthwellMinsterCopy = {
  audioHint: string
  eyebrow: string
  title: string
  tagline: string
  meta: string[]
  welcome: {
    invite: string
    videoUnsupported: string
    placeholderLabel: string
    role: string
    name: string
    title: string
  }
  toc: SouthwellTocItem[]
  history: {
    num: string
    heading: string
    lede: string
    paragraphs: string[]
    figureAlt: string
    figureCaption: string
    timelineLabel: string
    timeline: SouthwellTimelineItem[]
  }
  treasures: {
    num: string
    heading: string
    lede: string
    leavesHeading: string
    leavesBody: string
    figureAlt: string
    figureCaption: string
    features: SouthwellFeature[]
  }
  officers: {
    num: string
    heading: string
    lede: string
    people: SouthwellOfficer[]
    note: string
  }
  music: {
    num: string
    heading: string
    lede: string
    songHeading: string
    songParagraphs: string[]
    figureAlt: string
    figureCaption: string
    choirsHeading: string
    features: SouthwellFeature[]
    organsHeading: string
    organsBody: string
  }
  worship: {
    num: string
    heading: string
    lede: string
    paragraphs: string[]
    figureAlt: string
    figureCaption: string
    weekdayHeading: string
    weekdayRows: SouthwellClockRow[]
    sundayHeading: string
    sundayRows: SouthwellClockRow[]
    timesNote: string
  }
  visit: {
    num: string
    heading: string
    lede: string
    cards: SouthwellHoursCard[]
  }
  donate: {
    num: string
    heading: string
    paragraphs: string[]
    button: string
    donateHref: string
    after: string
    close: string
  }
  projects: {
    num: string
    heading: string
    lede: string
    placeholderLabel: string
    placeholderBody: string
  }
  contact: {
    num: string
    heading: string
    minsterHeading: string
    addressLabel: string
    addressLines: string[]
    telephoneLabel: string
    telephone: string
    telephoneDisplay: string
    mainOffice: string
    emailLabel: string
    email: string
    websiteLabel: string
    websiteUrl: string
    websiteDisplay: string
    urgentLabel: string
    urgentTel: string
    urgentDisplay: string
    shopLabel: string
    shopTel: string
    shopTelDisplay: string
    shopEmail: string
    gettingHereHeading: string
    gettingHere: string[]
    socialPrefix: string
    facebook: string
    facebookUrl: string
    twitter: string
    twitterUrl: string
    instagram: string
    instagramUrl: string
  }
  footer: {
    latinColophon: string
    credit: string
    photos: string
  }
}

export const SOUTHWELL_MINSTER_EN: SouthwellMinsterCopy = en
