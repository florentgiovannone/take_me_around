import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { isCheckedIn } from "../checkIn"

export default function RequireCheckIn({ children }: { children: ReactNode }) {
  if (!isCheckedIn()) return <Navigate to="/" replace />
  return children
}
