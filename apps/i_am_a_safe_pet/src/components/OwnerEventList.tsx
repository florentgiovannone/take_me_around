import { labelPetLocation } from "../data/petLocation"
import type { PetEvent } from "../data/types"

function formatWhen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function labelType(type: PetEvent["type"]): string {
  return type === "found" ? "Found" : "Scanned"
}

function labelDevice(device: PetEvent["device"]): string | null {
  if (!device) return null
  if (device === "mobile") return "Mobile"
  if (device === "tablet") return "Tablet"
  return "Desktop"
}

function DetailField({
  label,
  value,
}: {
  label: string
  value: string | number | boolean | null | undefined
}) {
  if (value === null || value === undefined || value === "") return null
  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)
  return (
    <div className="safe-pet-event-detail-field">
      <span className="safe-pet-event-detail-label">{label}</span>
      <span className="safe-pet-event-detail-value">{display}</span>
    </div>
  )
}

function EventDetails({ event }: { event: PetEvent }) {
  const locationLabel = event.petLocation
    ? labelPetLocation(event.petLocation)
    : null
  const deviceLabel = labelDevice(event.device)
  const showFoundLocation =
    event.type === "found" && Boolean(locationLabel || event.petLocationDetails)

  if (!showFoundLocation && !deviceLabel) return null

  return (
    <div className="safe-pet-event-details">
      {showFoundLocation ? (
        <div className="safe-pet-event-location">
          <DetailField label="Where is the pet" value={locationLabel} />
          <DetailField label="Details" value={event.petLocationDetails} />
        </div>
      ) : null}
      {deviceLabel ? (
        <div className="safe-pet-event-detail-grid">
          <DetailField label="Device" value={deviceLabel} />
        </div>
      ) : null}
    </div>
  )
}

export default function OwnerEventList({ events }: { events: PetEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="safe-pet-empty">
        No activity yet — you&rsquo;ll see it here when someone opens your
        pet&rsquo;s page or reports them found.
      </p>
    )
  }

  return (
    <ol className="safe-pet-event-list">
      {events.map((event) => (
        <li
          key={event.id}
          className={`safe-pet-event-item${
            event.type === "found" ? " safe-pet-event-item--found" : ""
          }`}
        >
          <div className="safe-pet-event-summary">
            <span className="safe-pet-event-when">{formatWhen(event.createdAt)}</span>
            <span
              className={`safe-pet-event-type${
                event.type === "found"
                  ? " safe-pet-event-type--found"
                  : " safe-pet-event-type--scan"
              }`}
            >
              {labelType(event.type)}
            </span>
          </div>
          <EventDetails event={event} />
        </li>
      ))}
    </ol>
  )
}
