import { useEffect, useState } from "react"
import {
  ALL_SITE_IDS,
  PICKABLE_SITE_IDS,
  PROJECT_DASHBOARD_SCOPES,
  SITE_META,
  scopeDomainHint,
  scopeLabel,
  type SiteId,
  type SiteScope,
} from "@tma/config"
import {
  normalizeEnabledSites,
  SETTINGS_SITE_IDS,
  storeEnabledSites,
  type EnabledDashboardSite,
} from "../config/dashboardSites"

type DashboardSettingsPageProps = {
  enabledSites: EnabledDashboardSite[]
  onSave: (sites: EnabledDashboardSite[]) => void
  onBack: () => void
}

function siteCopy(siteId: EnabledDashboardSite): { label: string; detail: string } {
  if ((ALL_SITE_IDS as readonly string[]).includes(siteId)) {
    const meta = SITE_META[siteId as SiteId]
    return { label: meta.label, detail: meta.host }
  }
  const label = scopeLabel(siteId as SiteScope)
  const detail = scopeDomainHint(siteId as SiteScope)
  return { label, detail: detail === label ? "" : detail }
}

function SiteToggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  disabled: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${checked ? "Disable" : "Enable"} ${label}`}
      disabled={disabled}
      className={`tma-dashboard-toggle${checked ? " is-on" : ""}`}
      onClick={onChange}
    >
      <span className="tma-dashboard-toggle-track" aria-hidden="true">
        <span className="tma-dashboard-toggle-thumb" />
      </span>
    </button>
  )
}

export default function DashboardSettingsPage({
  enabledSites,
  onSave,
  onBack,
}: DashboardSettingsPageProps) {
  const [draftSites, setDraftSites] = useState(enabledSites)

  useEffect(() => {
    setDraftSites(enabledSites)
  }, [enabledSites])

  const toggleSite = (siteId: EnabledDashboardSite) => {
    setDraftSites((current) => {
      const isEnabled = current.includes(siteId)
      if (isEnabled && current.length === 1) {
        return current
      }
      const next = isEnabled
        ? current.filter((id) => id !== siteId)
        : [...current, siteId]
      return normalizeEnabledSites(next)
    })
  }

  const handleReset = () => {
    setDraftSites(normalizeEnabledSites([...PICKABLE_SITE_IDS, ...PROJECT_DASHBOARD_SCOPES]))
  }

  const handleSave = () => {
    const next = normalizeEnabledSites(draftSites)
    storeEnabledSites(next)
    onSave(next)
    onBack()
  }

  return (
    <section className="tma-analytics-card tma-dashboard-settings">
      <div className="tma-analytics-card-header tma-dashboard-settings-header">
        <div>
          <h2>Dashboard settings</h2>
          <p className="tma-dashboard-settings-intro">
            Choose which sites appear in the site switcher and combined analytics view.
          </p>
        </div>
        <button type="button" className="tma-dashboard-settings-back" onClick={onBack}>
          Back to dashboard
        </button>
      </div>

      <div className="tma-dashboard-settings-list" role="group" aria-label="Enabled dashboard sites">
        {SETTINGS_SITE_IDS.map((siteId) => {
          const copy = siteCopy(siteId)
          const checked = draftSites.includes(siteId)
          const isLastEnabled = checked && draftSites.length === 1
          return (
            <div
              key={siteId}
              className={`tma-dashboard-settings-item${checked ? " is-enabled" : ""}`}
            >
              <div className="tma-dashboard-settings-item-copy">
                <strong>{copy.label}</strong>
                {copy.detail ? <span>{copy.detail}</span> : null}
              </div>
              <SiteToggle
                checked={checked}
                disabled={isLastEnabled}
                onChange={() => toggleSite(siteId)}
                label={copy.label}
              />
            </div>
          )
        })}
      </div>

      <p className="tma-dashboard-settings-note">At least one site must stay enabled.</p>

      <div className="tma-dashboard-settings-actions">
        <button type="button" className="tma-dashboard-settings-reset" onClick={handleReset}>
          Reset to defaults
        </button>
        <button type="button" className="tma-dashboard-settings-save" onClick={handleSave}>
          Save and return
        </button>
      </div>
    </section>
  )
}
