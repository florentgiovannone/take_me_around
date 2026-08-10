import { Link } from "react-router-dom"

export default function PrivacyPolicyPage() {
  return (
    <main className="safe-pet-page safe-pet-privacy">
      <h1 className="safe-pet-display">Privacy policy</h1>
      <p>
        I Am A Safe Pet is designed for lost-pet recovery. When someone scans a
        pet&rsquo;s tag, the public pet page intentionally shows finder-facing
        contact details (owner name, phone number, and vet contact) so the
        animal can be returned safely.
      </p>
      <p>
        Personality notes, allergies, and related safety information are shown
        for the finder&rsquo;s benefit. Do not place information on a public tag
        that you would not want a stranger to read.
      </p>
      <p>
        In this demo build, scan and &ldquo;found&rdquo; events are stored in
        your browser&rsquo;s local storage on the device that records them. No
        Backend account system is used in v1.
      </p>
      <p className="safe-pet-footer-links">
        <Link to="/">Back home</Link>
      </p>
    </main>
  )
}
