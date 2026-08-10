import { useEffect, useState, type FormEvent } from "react"
import { Link, useParams } from "react-router-dom"
import PetInfoPanel from "../components/PetInfoPanel"
import { collectBrowserEventContext } from "../data/eventContext"
import {
  PET_LOCATION_OPTIONS,
  detailsForPetLocationChange,
  petLocationDetailsLabel,
  validateFoundLocationForm,
} from "../data/petLocation"
import { getSafePetRepository } from "../data/repository"
import {
  hasRecordedScanThisSession,
  markScanRecordedThisSession,
} from "../data/scanSession"
import type { PetLocation, PetProfile } from "../data/types"

export default function PublicPetPage() {
  const { publicId = "" } = useParams()
  const [pet, setPet] = useState<PetProfile | null | undefined>(undefined)
  const [foundConfirm, setFoundConfirm] = useState(false)
  const [showFoundForm, setShowFoundForm] = useState(false)
  const [petLocation, setPetLocation] = useState<PetLocation | null>(null)
  const [petLocationDetails, setPetLocationDetails] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [recordingFound, setRecordingFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    const repo = getSafePetRepository()
    void repo.getPetByPublicId(publicId).then(async (result) => {
      if (cancelled) return
      setPet(result)
      if (!result) return
      if (hasRecordedScanThisSession(sessionStorage, result.publicId)) return
      await repo.recordEvent({
        petId: result.id,
        publicId: result.publicId,
        type: "scan",
        source: "page_view",
        ...collectBrowserEventContext({ publicId: result.publicId }),
      })
      markScanRecordedThisSession(sessionStorage, result.publicId)
    })
    return () => {
      cancelled = true
    }
  }, [publicId])

  function openFoundForm() {
    if (foundConfirm || recordingFound) return
    setShowFoundForm(true)
    setFormError(null)
  }

  function cancelFoundForm() {
    if (recordingFound) return
    setShowFoundForm(false)
    setPetLocation(null)
    setPetLocationDetails("")
    setFormError(null)
  }

  async function onFoundSubmit(event: FormEvent) {
    event.preventDefault()
    if (!pet || recordingFound) return
    const error = validateFoundLocationForm(petLocation, petLocationDetails)
    if (error || !petLocation) {
      setFormError(error ?? "Choose where the pet is.")
      return
    }
    setRecordingFound(true)
    setFormError(null)
    await getSafePetRepository().recordEvent({
      petId: pet.id,
      publicId: pet.publicId,
      type: "found",
      source: "finder_cta",
      petLocation,
      petLocationDetails: petLocationDetails.trim(),
      ...collectBrowserEventContext({ publicId: pet.publicId }),
    })
    setFoundConfirm(true)
    setShowFoundForm(false)
    setRecordingFound(false)
  }

  if (pet === undefined) {
    return (
      <main className="safe-pet-page">
        <p>Loading…</p>
      </main>
    )
  }

  if (pet === null) {
    return (
      <main className="safe-pet-page">
        <h1>Pet not found</h1>
        <p>This tag is not linked to a pet profile.</p>
        <p>
          <Link to="/">Back home</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="safe-pet-page safe-pet-public">
      <p className="safe-pet-kicker">You found me</p>
      <h1 className="safe-pet-display">{pet.name}</h1>
      {pet.photoUrl ? (
        <img className="safe-pet-photo" src={pet.photoUrl} alt={pet.name} />
      ) : null}
      {pet.breed ? (
        <p className="safe-pet-meta">
          {pet.species}
          {pet.breed ? ` · ${pet.breed}` : ""}
        </p>
      ) : (
        <p className="safe-pet-meta">{pet.species}</p>
      )}
      <p className="safe-pet-support">
        Please read the personality notes before approaching, then contact my
        owner.
      </p>
      <PetInfoPanel pet={pet} />
      <div className="safe-pet-actions">
        {foundConfirm ? (
          <p className="safe-pet-found-confirm" role="status">
            Owner will be notified — thank you.
          </p>
        ) : showFoundForm ? (
          <form className="safe-pet-found-form" onSubmit={(e) => void onFoundSubmit(e)}>
            <fieldset className="safe-pet-found-fieldset">
              <legend>Where is the pet?</legend>
              <div className="safe-pet-found-options" role="radiogroup" aria-label="Where is the pet">
                {PET_LOCATION_OPTIONS.map((option) => (
                  <label key={option.value} className="safe-pet-found-option">
                    <input
                      type="radio"
                      name="pet-location"
                      value={option.value}
                      checked={petLocation === option.value}
                      onChange={() => {
                        setPetLocation(option.value)
                        setPetLocationDetails((current) =>
                          detailsForPetLocationChange(
                            option.value,
                            current,
                            pet.vetContact
                          )
                        )
                        setFormError(null)
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {petLocation ? (
              <div className="safe-pet-found-details">
                <label htmlFor="pet-location-details">
                  {petLocationDetailsLabel(petLocation)}
                </label>
                <textarea
                  id="pet-location-details"
                  rows={3}
                  value={petLocationDetails}
                  onChange={(e) => {
                    setPetLocationDetails(e.target.value)
                    setFormError(null)
                  }}
                  placeholder={
                    petLocation === "with_another_vet"
                      ? "e.g. Oak Vet Clinic, +44 1234 567890, 2 Oak Road"
                      : petLocation === "with_his_vet"
                        ? "e.g. At their usual vet — ask for reception"
                        : "e.g. Near the park gate on High Street — happy to wait"
                  }
                  required
                />
              </div>
            ) : null}
            {formError ? <p className="safe-pet-form-error">{formError}</p> : null}
            <div className="safe-pet-found-form-actions">
              <button
                type="submit"
                className="safe-pet-btn safe-pet-btn-primary"
                disabled={recordingFound}
              >
                {recordingFound ? "Notifying…" : "Notify owner"}
              </button>
              <button
                type="button"
                className="safe-pet-btn safe-pet-btn-ghost"
                onClick={cancelFoundForm}
                disabled={recordingFound}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={openFoundForm}>
            I found this pet
          </button>
        )}
      </div>
      <p className="safe-pet-footer-links">
        <Link to="/">About I&rsquo;m a safe pet</Link>
        {" · "}
        <Link to="/privacy-policy">Privacy</Link>
      </p>
    </main>
  )
}
