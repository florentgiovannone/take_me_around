export function BrandHeader({ homeHref = "/" }: { homeHref?: string }) {
  return (
    <div className="tma-brand-bar">
      <a className="tma-brand-word" href={homeHref}>
        <svg className="tma-brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="16" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 3v4M16 25v4M3 16h4M25 16h4" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        TAKE <span>ME</span> AROUND
      </a>
    </div>
  )
}
