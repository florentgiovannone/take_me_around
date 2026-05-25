import type { SiteId, SiteScope } from "@tma/config"

export type OperatorProfile = {
  id: string
  name: string
  sites: SiteId[]
}

export const OPERATOR_SESSION_KEY = "tma-main-dashboard-operator-id"
export const SCOPE_SESSION_KEY = "tma-main-dashboard-scope"

/** Static operator list until backend profiles exist. */
export const OPERATORS: OperatorProfile[] = [
  {
    id: "default",
    name: "Main Dashboard",
    sites: ["gallery", "museum"],
  },
  {
    id: "museum-only",
    name: "Museum team",
    sites: ["museum"],
  },
  {
    id: "gallery-only",
    name: "Gallery team",
    sites: ["gallery"],
  },
]

export const DEFAULT_OPERATOR_ID = "default"

export function getOperatorById(id: string): OperatorProfile | undefined {
  return OPERATORS.find((operator) => operator.id === id)
}

export function siteScopesForOperator(operator: OperatorProfile): SiteScope[] {
  const scopes: SiteScope[] = [...operator.sites]
  if (operator.sites.length > 1) {
    scopes.push("combined")
  }
  return scopes
}

export function getStoredOperatorId(): string | null {
  return sessionStorage.getItem(OPERATOR_SESSION_KEY)
}

export function storeOperatorSession(operatorId: string) {
  sessionStorage.setItem(OPERATOR_SESSION_KEY, operatorId)
}

export function clearOperatorSession() {
  sessionStorage.removeItem(OPERATOR_SESSION_KEY)
  sessionStorage.removeItem(SCOPE_SESSION_KEY)
}

export function getStoredScope(): SiteScope | null {
  const raw = sessionStorage.getItem(SCOPE_SESSION_KEY)
  if (raw === "gallery" || raw === "museum" || raw === "combined") return raw
  return null
}

export function storeScope(scope: SiteScope) {
  sessionStorage.setItem(SCOPE_SESSION_KEY, scope)
}

/** Resolve operator from session, build env, or default. */
export function resolveOperator(preferredId?: string | null): OperatorProfile {
  const envId =
    typeof import.meta.env.VITE_DASHBOARD_OPERATOR_ID === "string"
      ? import.meta.env.VITE_DASHBOARD_OPERATOR_ID.trim()
      : ""
  const id = preferredId ?? getStoredOperatorId() ?? (envId || DEFAULT_OPERATOR_ID)
  return getOperatorById(id) ?? getOperatorById(DEFAULT_OPERATOR_ID) ?? OPERATORS[0]
}

export function defaultScopeForOperator(operator: OperatorProfile): SiteScope {
  return siteScopesForOperator(operator)[0]
}

export function normalizeScopeForOperator(
  scope: SiteScope | null | undefined,
  operator: OperatorProfile
): SiteScope {
  const allowed = siteScopesForOperator(operator)
  if (scope && allowed.includes(scope)) return scope
  return allowed[0]
}
