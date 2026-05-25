import { parseLogTimestampGmt } from "@tma/dashboard-scope"

export function formatLogTimestamp(value: string | null) {
  const date = parseLogTimestampGmt(value)
  if (!date) return null

  const day = String(date.getUTCDate()).padStart(2, "0")
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const year = date.getUTCFullYear()
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")

  return {
    date: `${day}/${month}/${year}`,
    time: `${hours}:${minutes} GMT`,
  }
}

function formatLogTimestampUtcDisplay(value: string | null) {
  const formatted = formatLogTimestamp(value)
  if (!formatted) return null
  return `${formatted.date} ${formatted.time}`
}

/** Relative time for Latest Scan — naive API timestamps treated as UTC. */
export function formatRelativeTime(value: string | null) {
  const timestamp = parseLogTimestampGmt(value)
  if (!timestamp) return "-"

  const diffMs = Date.now() - timestamp.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return formatLogTimestampUtcDisplay(value) ?? "-"
}

export function messageTypeClass(value: string | null) {
  const normalized = (value ?? "").toUpperCase()
  if (normalized === "REDIRECTED") return "is-redirected"
  if (normalized === "SEEN") return "is-seen"
  return "is-default"
}
