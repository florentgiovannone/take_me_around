import { useEffect, useState } from "react"
import { BrandHeader } from "@tma/brand"
import type { PoiseLog } from "@tma/dashboard-scope"
import { latestBoothArtwork, type BoothArtwork } from "../scanRegistrations"
import "../styles/home.css"

const POLL_INTERVAL_MS = 5000
const TITLE_SUFFIX = " | Museum Association Conference"

async function fetchScanLogs(): Promise<PoiseLog[] | null> {
  try {
    const response = await fetch("/api/secure/items")
    if (!response.ok) return null
    const data = (await response.json()) as PoiseLog[]
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

function applyArtwork(
  current: BoothArtwork | null,
  next: BoothArtwork | null
): BoothArtwork | null {
  if (!next) return current
  if (current?.url === next.url) return current
  return next
}

export default function LatestScanPage() {
  const [artwork, setArtwork] = useState<BoothArtwork | null>(null)
  const [refreshError, setRefreshError] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const logs = await fetchScanLogs()
      if (cancelled) return
      if (!logs) {
        setRefreshError(true)
        return
      }
      setRefreshError(false)
      setArtwork((current) => applyArtwork(current, latestBoothArtwork(logs)))
    }

    void load()
    const interval = setInterval(() => {
      void load()
    }, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    document.title = `${artwork?.title ?? "Latest scan"}${TITLE_SUFFIX}`
  }, [artwork])

  if (artwork) {
    return (
      <iframe
        key={artwork.url}
        className="birmingham-latest-frame"
        title={artwork.title}
        src={artwork.url}
      />
    )
  }

  return (
    <div className="birmingham-latest-wait">
      <BrandHeader homeHref="https://takemearound.com/" />
      <main>
        <h1>Take Me Around</h1>
        <p>Waiting for a scan.</p>
        {refreshError ? <p className="birmingham-latest-error">Couldn&apos;t refresh scans</p> : null}
      </main>
    </div>
  )
}
