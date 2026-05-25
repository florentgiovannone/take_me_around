import { scopeOptionLabel, type SiteScope } from "@tma/config"

type ScopeSwitcherProps = {
  scopes: SiteScope[]
  value: SiteScope
  onChange: (scope: SiteScope) => void
  id?: string
}

export default function ScopeSwitcher({
  scopes,
  value,
  onChange,
  id = "dashboard-scope",
}: ScopeSwitcherProps) {
  if (scopes.length === 0) return null

  if (scopes.length === 1) {
    return (
      <span className="tma-scope-switcher tma-scope-switcher--single" aria-live="polite">
        <span className="tma-scope-switcher-label">Viewing</span>
        <span className="tma-scope-switcher-value">{scopeOptionLabel(scopes[0])}</span>
      </span>
    )
  }

  return (
    <label className="tma-scope-switcher" htmlFor={id}>
      <span className="tma-scope-switcher-label">Site</span>
      <select
        id={id}
        className="tma-scope-switcher-select"
        value={value}
        onChange={(event) => onChange(event.target.value as SiteScope)}
        aria-label="Switch site or combined view"
      >
        {scopes.map((scope) => (
          <option key={scope} value={scope}>
            {scopeOptionLabel(scope)}
          </option>
        ))}
      </select>
    </label>
  )
}
