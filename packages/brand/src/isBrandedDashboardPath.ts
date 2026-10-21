const BRANDED_DASHBOARD_PATHS = new Set([
  "/",
  "/demodashboard",
  "/dashboard",
  "/dashboard/museum",
])

export function isBrandedDashboardPath(pathname: string): boolean {
  return BRANDED_DASHBOARD_PATHS.has(pathname)
}
