import { useEffect, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import OwnerEventList from "../components/OwnerEventList"
import {
  labelPetVisualStatus,
  resolvePetVisualStatus,
} from "../data/petVisualStatus"
import { DEMO_OWNER_ACCOUNT_ID } from "../data/seed"
import { getSafePetRepository } from "../data/repository"
import type { PetEvent, PetProfile } from "../data/types"

const OWNER_AUTH_KEY = "tma-safe-pet-owner-auth"

function expectedPassword(): string {
  return import.meta.env.VITE_OWNER_DEMO_PASSWORD?.trim() || "safe-pet-demo"
}

function lastOfType(events: PetEvent[], type: PetEvent["type"]): PetEvent | null {
  return events.find((e) => e.type === type) ?? null
}

function formatWhen(iso: string | undefined): string {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function statusBannerCopy(
  status: ReturnType<typeof resolvePetVisualStatus>,
  lastScan: PetEvent | null,
  lastFound: PetEvent | null
): string {
  if (status === "found") {
    return `Reported found${lastFound ? ` · ${formatWhen(lastFound.createdAt)}` : ""}`
  }
  if (status === "scanned") {
    return `Tag scanned${lastScan ? ` · ${formatWhen(lastScan.createdAt)}` : ""}`
  }
  return "No scans or found reports yet"
}

export default function OwnerDashboardPage() {
  const [authorized, setAuthorized] = useState(
    () => sessionStorage.getItem(OWNER_AUTH_KEY) === "1"
  )
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pets, setPets] = useState<PetProfile[]>([])
  const [events, setEvents] = useState<PetEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authorized) return
    let cancelled = false
    setLoading(true)
    const repo = getSafePetRepository()
    void Promise.all([
      repo.listPetsForOwner(DEMO_OWNER_ACCOUNT_ID),
      repo.listEventsForOwner(DEMO_OWNER_ACCOUNT_ID),
    ]).then(([nextPets, nextEvents]) => {
      if (cancelled) return
      setPets(nextPets)
      setEvents(nextEvents)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [authorized])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (password === expectedPassword()) {
      sessionStorage.setItem(OWNER_AUTH_KEY, "1")
      setAuthorized(true)
      setError(null)
      setPassword("")
      return
    }
    setError("Incorrect password. Check the app README for the demo password.")
  }

  function signOut() {
    sessionStorage.removeItem(OWNER_AUTH_KEY)
    setAuthorized(false)
    setPets([])
    setEvents([])
  }

  if (!authorized) {
    return (
      <main className="safe-pet-page safe-pet-owner">
        <h1 className="safe-pet-display">Your pets</h1>
        <p className="safe-pet-support">
          Sign in to see when your pet&rsquo;s tag was scanned or reported found.
        </p>
        <form className="safe-pet-owner-form" onSubmit={onSubmit}>
          <label htmlFor="owner-password">Password</label>
          <input
            id="owner-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="safe-pet-form-error">{error}</p> : null}
          <button type="submit" className="safe-pet-btn safe-pet-btn-primary">
            Sign in
          </button>
        </form>
        <p className="safe-pet-footer-links">
          <Link to="/">Back home</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="safe-pet-page safe-pet-owner">
      <header className="safe-pet-owner-header">
        <h1 className="safe-pet-display">Your pets</h1>
        <button type="button" className="safe-pet-btn safe-pet-btn-ghost" onClick={signOut}>
          Sign out
        </button>
      </header>
      {loading ? <p>Loading…</p> : null}
      {!loading &&
        pets.map((pet) => {
          const petEvents = events.filter((e) => e.petId === pet.id)
          const lastScan = lastOfType(petEvents, "scan")
          const lastFound = lastOfType(petEvents, "found")
          const status = resolvePetVisualStatus(petEvents)
          return (
            <section
              key={pet.id}
              className={`safe-pet-owner-pet safe-pet-owner-pet--${status}`}
              data-status={status}
            >
              <div className="safe-pet-owner-pet-heading">
                <h2 className="safe-pet-display">{pet.name}</h2>
                <span
                  className={`safe-pet-status-chip safe-pet-status-chip--${status}`}
                >
                  {labelPetVisualStatus(status)}
                </span>
              </div>
              <p
                className={`safe-pet-status-banner safe-pet-status-banner--${status}`}
                role="status"
              >
                {statusBannerCopy(status, lastScan, lastFound)}
              </p>
              <ul className="safe-pet-owner-stats">
                <li>Last scanned: {formatWhen(lastScan?.createdAt)}</li>
                <li>Last found: {formatWhen(lastFound?.createdAt)}</li>
              </ul>
              <h3>Recent activity</h3>
              <OwnerEventList events={petEvents} />
            </section>
          )
        })}
      <p className="safe-pet-footer-links">
        <Link to="/">Home</Link>
      </p>
    </main>
  )
}
