/** Netlify CONTEXT / NETLIFY_CONTEXT: production | deploy-preview | branch-deploy | dev */
function netlifyContext() {
  return (process.env.CONTEXT || process.env.NETLIFY_CONTEXT || "").trim()
}

/** Production deploys must set VITE_API_PROXY_TARGET so /api/* is proxied. */
export function netlifyProductionRequiresProxyTarget() {
  return netlifyContext() === "production"
}

/**
 * Whether to add `/api/* → backend` to _redirects.
 * Preview/branch Netlify builds skip the proxy (client uses VITE_API_BASE_URL + CORS).
 */
export function shouldEmitApiProxyRedirectLine(target) {
  if (!target) return false
  if (process.env.NETLIFY === "true") {
    const ctx = netlifyContext()
    if (ctx && ctx !== "production") return false
  }
  return true
}
