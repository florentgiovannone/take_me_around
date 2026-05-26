import { useEffect } from "react"

const ARKIN_DASHBOARD_URL =
  import.meta.env.VITE_ARKIN_DASHBOARD_URL ?? "https://arkin.takemearound.gallery"

type ExternalDashboardRedirectProps = {
  /** Path on the main dashboard host (e.g. `/dashboard` for gallery-only scope). */
  path?: string
}

export default function ExternalDashboardRedirect({
  path = "/",
}: ExternalDashboardRedirectProps) {
  useEffect(() => {
    const target = new URL(path, ARKIN_DASHBOARD_URL)
    window.location.replace(target.toString())
  }, [path])

  return (
    <main
      className="tma-analytics-card tma-dashboard-status-card"
      style={{ margin: "2rem auto", maxWidth: 480, padding: "1.5rem" }}
    >
      <p>Redirecting to the analytics dashboard…</p>
    </main>
  )
}
