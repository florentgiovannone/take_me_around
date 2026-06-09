import type { ReactNode } from "react"
import RodinSiteFooter from "./RodinSiteFooter"
import RodinSiteHeader from "./RodinSiteHeader"

type RodinSiteShellProps = {
  children: ReactNode
}

export default function RodinSiteShell({ children }: RodinSiteShellProps) {
  return (
    <div className="arkin-site">
      <RodinSiteHeader />
      {children}
      <RodinSiteFooter />
    </div>
  )
}
