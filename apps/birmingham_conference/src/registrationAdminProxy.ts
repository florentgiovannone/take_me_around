export function registrationAdminHomeTarget(registrationBase: string, search = ""): string {
  return `${registrationBase.replace(/\/$/, "")}/admin${search}`
}
