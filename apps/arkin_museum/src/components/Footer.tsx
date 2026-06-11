type FooterProps = {
  /** Artwork pages: link to Take Me Around only (no address or copyright). */
  variant?: "default" | "artwork"
}

export default function Footer({ variant = "default" }: FooterProps) {
  if (variant === "artwork") {
    return (
      <footer className="tma-footer tma-footer--artwork">
        <div className="tma-footer-inner">
          <a className="tma-footer-home-link" href="https://takemearound.com/">
            takemearound.com
          </a>
        </div>
      </footer>
    )
  }

  return (
    <footer className="tma-footer">
      <div className="tma-footer-inner">
        <p className="tma-footer-address">
          Take Me Around Ltd. Registered office: Parkgate House, 33a Pratt Street, NW1 0BG
        </p>
        <p className="tma-footer-copyright">Copyright © 2025 Take Me Around Ltd.</p>
      </div>
    </footer>
  )
}
