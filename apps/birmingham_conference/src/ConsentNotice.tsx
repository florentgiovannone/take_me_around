import { CONSENT_LABEL, PRIVACY_POLICY_HREF, PRIVACY_POLICY_LINK_TEXT } from "./interestForm"
import "./styles/consent.css"

type ConsentNoticeProps = {
  checked: boolean
  error?: string
  errorClassName?: string
  onChange: (checked: boolean) => void
}

export default function ConsentNotice({
  checked,
  error,
  errorClassName = "birmingham-interest-error",
  onChange,
}: ConsentNoticeProps) {
  return (
    <>
      <label className="birmingham-interest-consent">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="req">{CONSENT_LABEL}</span>
      </label>
      {error ? <span className={errorClassName}>{error}</span> : null}
      <p className="birmingham-interest-privacy">
        <a href={PRIVACY_POLICY_HREF} target="_blank" rel="noopener noreferrer">
          {PRIVACY_POLICY_LINK_TEXT}
        </a>
      </p>
    </>
  )
}
