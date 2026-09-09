import { useEffect, useId, useState } from "react"
import { useMediaQuery } from "../hooks/useMediaQuery"
import "../styles/dashboard-tabs-nav.css"

export type DashboardTabId = "activity" | "counts" | "overview" | "audience" | "sar"

export type DashboardTabsNavLabels = {
  activity: string
  counts: string
  overview: string
  audience: string
  liveSessions: string
  dashboardViews?: string
  openMenu?: string
  closeMenu?: string
}

type DashboardTabsNavProps = {
  activeTab: DashboardTabId
  onChange: (tab: DashboardTabId) => void
  tabs?: DashboardTabId[]
  labels?: DashboardTabsNavLabels
  className?: string
}

const DEFAULT_LABELS: Required<DashboardTabsNavLabels> = {
  activity: "Activity",
  counts: "Link scan counts",
  overview: "Overview",
  audience: "Audience",
  liveSessions: "Live sessions",
  dashboardViews: "Dashboard views",
  openMenu: "Open menu",
  closeMenu: "Close menu",
}

const TAB_IDS: DashboardTabId[] = [
  "activity",
  "counts",
  "overview",
  "audience",
  "sar",
]

function labelForTab(tab: DashboardTabId, labels: Required<DashboardTabsNavLabels>) {
  if (tab === "sar") return labels.liveSessions
  return labels[tab]
}

export default function DashboardTabsNav({
  activeTab,
  onChange,
  tabs: visibleTabIds = TAB_IDS,
  labels,
  className,
}: DashboardTabsNavProps) {
  const copy = { ...DEFAULT_LABELS, ...labels }
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const navClassName = ["tma-dashboard-tabs-nav", className].filter(Boolean).join(" ")

  useEffect(() => {
    if (!isMobile) setOpen(false)
  }, [isMobile])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const selectTab = (tab: DashboardTabId) => {
    onChange(tab)
    setOpen(false)
  }

  const tabs = visibleTabIds.map((id) => ({
    id,
    label: labelForTab(id, copy),
  }))

  return (
    <nav className={navClassName} aria-label={copy.dashboardViews}>
      {isMobile ? (
        <>
          <div className="tma-dashboard-menu-bar">
            <button
              type="button"
              className={`tma-dashboard-menu-toggle${open ? " is-open" : ""}`}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((current) => !current)}
            >
              <span className="tma-dashboard-menu-toggle-bar" aria-hidden="true" />
              <span className="tma-dashboard-menu-toggle-bar" aria-hidden="true" />
              <span className="tma-dashboard-menu-toggle-bar" aria-hidden="true" />
              <span className="tma-dashboard-menu-toggle-sr">
                {open ? copy.closeMenu : copy.openMenu}
              </span>
            </button>
            <p className="tma-dashboard-menu-current">{labelForTab(activeTab, copy)}</p>
          </div>

          {open ? (
            <button
              type="button"
              className="tma-dashboard-menu-backdrop"
              aria-label={copy.closeMenu}
              onClick={() => setOpen(false)}
            />
          ) : null}

          <div
            id={panelId}
            className={`tma-dashboard-menu-panel${open ? " is-open" : ""}`}
            inert={!open ? true : undefined}
          >
            <p className="tma-dashboard-menu-heading">{copy.dashboardViews}</p>
            <div role="tablist" aria-label={copy.dashboardViews}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`tma-dashboard-menu-item${activeTab === tab.id ? " is-active" : ""}`}
                  onClick={() => selectTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="tma-dashboard-tabs tma-dashboard-tabs--wrap" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tma-dashboard-tab${tab.id === "sar" ? " tma-dashboard-tab--span-2" : ""}${
                activeTab === tab.id ? " is-active" : ""
              }`}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
