import "../styles/style.css"

const SUPPORT_EMAIL = "support@takemearound.gallery"

export default function MaintenancePage() {
  return (
    <div className="tma-maintenance-shell">
      <main className="tma-maintenance-main">
        <p className="tma-maintenance-eyebrow">Take Me Around</p>
        <h1 className="tma-maintenance-title">Sorry, this page isn&apos;t available anymore</h1>
        <p className="tma-maintenance-message">
          Please contact{" "}
          <a className="tma-maintenance-link" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>{" "}
          if you have any questions.
        </p>
      </main>
    </div>
  )
}
