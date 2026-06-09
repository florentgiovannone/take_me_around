/** Parse JSON; throws if the host returned SPA HTML (e.g. Netlify without an API proxy). */
export async function parseApiJson<T>(response: Response): Promise<T> {
  const ct = response.headers.get("content-type") || ""
  if (ct.includes("application/json")) {
    return (await response.json()) as T
  }
  const text = await response.text()
  if (/<!doctype|<html/i.test(text)) {
    if (/ngrok|ERR_NGROK/i.test(text)) {
      throw new Error(
        "Ngrok returned its browser warning page instead of API data. Redeploy the latest frontend (it sends ngrok-skip-browser-warning), or open the ngrok URL once in a tab and click Continue."
      )
    }
    throw new Error(
      "Received the web app (HTML) instead of API data. Netlify is not proxying /api/* to your backend. Set VITE_API_PROXY_TARGET in Netlify env vars, then Deploy → Clear cache and deploy site. Check dist/_redirects contains a line starting with /api/*"
    )
  }
  throw new Error(`Expected JSON from the API, got: ${ct || "unknown"}`)
}
