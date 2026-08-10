import { Fragment } from "react"
import type { PetProfile } from "../data/types"

function telHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`
}

/** UK/intl-ish numbers: enough digits, and only phone punctuation. */
function looksLikePhone(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return false
  const digits = trimmed.replace(/\D/g, "")
  return digits.length >= 7 && /^[\d\s+().\-]+$/.test(trimmed)
}

/** Match a phone-like run inside mixed clinic text. */
const EMBEDDED_PHONE =
  /(?:\+?\d[\d\s().-]{5,}\d)/

function renderLineWithPhone(line: string) {
  const trimmed = line.trim()
  if (looksLikePhone(trimmed)) {
    return <a href={telHref(trimmed)}>{trimmed}</a>
  }

  const match = trimmed.match(EMBEDDED_PHONE)
  if (!match || match.index === undefined) {
    return trimmed
  }

  const phone = match[0].trim()
  if (!looksLikePhone(phone)) {
    return trimmed
  }

  const start = match.index
  const end = start + match[0].length
  return (
    <>
      {trimmed.slice(0, start)}
      <a href={telHref(phone)}>{phone}</a>
      {trimmed.slice(end)}
    </>
  )
}

function VetContactDetails({ value }: { value: string }) {
  const lines = value.split("\n")

  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={`${index}-${line}`}>
          {index > 0 ? <br /> : null}
          {renderLineWithPhone(line)}
        </Fragment>
      ))}
    </>
  )
}

export default function PetInfoPanel({ pet }: { pet: PetProfile }) {
  return (
    <dl className="safe-pet-info">
      <div>
        <dt>My name is:</dt>
        <dd>{pet.name}</dd>
      </div>
      <div>
        <dt>Owner name:</dt>
        <dd>{pet.ownerName}</dd>
      </div>
      <div>
        <dt>Contact number:</dt>
        <dd>
          <a href={telHref(pet.contactNumber)}>{pet.contactNumber}</a>
        </dd>
      </div>
      <div className="safe-pet-personality">
        <dt>Animal&apos;s personality:</dt>
        <dd>{pet.personality}</dd>
      </div>
      <div>
        <dt>Allergies:</dt>
        <dd>{pet.allergies}</dd>
      </div>
      <div>
        <dt>Vets contact details:</dt>
        <dd>
          <VetContactDetails value={pet.vetContact} />
        </dd>
      </div>
    </dl>
  )
}
