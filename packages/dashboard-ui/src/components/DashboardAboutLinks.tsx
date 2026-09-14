import { getDashboardLocale } from "@tma/config"
import { dashboardCopy } from "../i18n/copy"
import "../styles/dashboard-about-links.css"

const BUSINESS_HREF = "https://takemearound.com/"
const TECHNOLOGY_HREF = "https://poiseinfotech.com/"

export default function DashboardAboutLinks() {
  const copy = dashboardCopy(getDashboardLocale())

  return (
    <nav className="tma-dashboard-about-links" aria-label={copy.aboutLinksLabel}>
      <p className="tma-dashboard-about-links-heading">{copy.aboutLinksHeading}</p>
      <div className="tma-dashboard-about-links-row">
        <a
          className="tma-dashboard-about-link"
          href={BUSINESS_HREF}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="tma-dashboard-about-link-kicker">{copy.aboutBusiness}</span>
          <span className="tma-dashboard-about-link-host">takemearound.com</span>
        </a>
        <a
          className="tma-dashboard-about-link"
          href={TECHNOLOGY_HREF}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="tma-dashboard-about-link-kicker">{copy.aboutTechnology}</span>
          <span className="tma-dashboard-about-link-host">poiseinfotech.com</span>
        </a>
      </div>
    </nav>
  )
}
