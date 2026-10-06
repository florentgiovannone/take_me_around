type FriezeLogoProps = {
  className?: string
}

export default function FriezeLogo({ className }: FriezeLogoProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 101 22"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M13.392.24v3.152H4.496v6.912h8.352v2.944H4.496V22H.72V.24zM29.1 22l-3.664-8.096h-4.128V22h-3.744V.24h7.68q3.6 0 5.488 1.76c1.888 1.76 1.888 2.885 1.888 5.136q0 2.304-.96 3.824-.945 1.504-2.752 2.192L33.292 22zM21.308 3.344v7.488h3.632q1.92 0 2.912-.944 1.008-.96 1.008-2.8t-1.008-2.784q-.992-.96-2.912-.96zM48.512 22h-12.24v-3.072h4.24V3.312h-4.24V.24h12.24v3.072h-4.224v15.616h4.224zm8.109-9.232v6.096h9.248V22H52.845V.24h12.928v3.136h-9.152V9.84h8.608v2.928zM69.588.24h14.528l-9.712 18.608h9.232V22H68.74l9.68-18.624h-8.832zM91.62 12.768v6.096h9.248V22H87.845V.24h12.928v3.136h-9.152V9.84h8.608v2.928z"
      />
    </svg>
  )
}
