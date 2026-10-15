import { LocaleLink, useUiCopy } from "../i18n/locale"

export default function SiteFooter() {
  const copy = useUiCopy()

  return (
    <footer className="site-footer">
      <p>
        <LocaleLink to="/terms">{copy.terms}</LocaleLink>
        <span aria-hidden="true"> · </span>
        <LocaleLink to="/privacy">{copy.privacy}</LocaleLink>
      </p>
      <p>{copy.footerNote}</p>
    </footer>
  )
}
