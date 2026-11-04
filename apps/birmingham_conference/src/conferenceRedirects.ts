export function conferenceRedirects(args: {
  proxyBase: string
  registrationBase: string
}): string[] {
  const lines: string[] = []
  if (args.proxyBase) {
    lines.push(`/api/*  ${args.proxyBase}/api/:splat  200`)
  }
  if (args.registrationBase) {
    lines.push(`/registration-api/*  ${args.registrationBase}/:splat  200`)
    lines.push(`/confirm  ${args.registrationBase}/confirm  200`)
    lines.push(`/admin/*  ${args.registrationBase}/admin/:splat  200`)
    lines.push(`/admin  ${args.registrationBase}/admin  200`)
    lines.push(`/static/*  ${args.registrationBase}/static/:splat  200`)
  }
  lines.push("/*    /index.html   200")
  return lines
}
