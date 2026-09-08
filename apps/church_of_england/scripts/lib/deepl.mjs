const DEFAULT_API_URL = "https://api-free.deepl.com"
const BATCH_SIZE = 40

export async function getDeepLUsage(apiKey, apiUrl = DEFAULT_API_URL) {
  const response = await fetch(`${apiUrl}/v2/usage`, {
    headers: { Authorization: `DeepL-Auth-Key ${apiKey}` },
  })
  if (!response.ok) {
    throw new Error(`DeepL usage failed: ${response.status}`)
  }
  return response.json()
}

/**
 * @param {string[]} texts
 * @param {{ apiKey: string, apiUrl?: string, targetLang: string, tagHandling?: string }} options
 * @returns {Promise<string[]>}
 */
export async function translateTexts(
  texts,
  { apiKey, apiUrl = DEFAULT_API_URL, targetLang, tagHandling },
) {
  if (texts.length === 0) return []

  const translated = []
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const payload = {
      text: batch,
      source_lang: "EN",
      target_lang: targetLang,
    }
    if (tagHandling) payload.tag_handling = tagHandling

    const response = await fetch(`${apiUrl}/v2/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const body = await response.text()
    if (!response.ok) {
      throw new Error(`DeepL translate failed: ${response.status} ${body}`)
    }

    const data = JSON.parse(body)
    translated.push(...data.translations.map((item) => item.text))
  }

  return translated
}

export function countCharacters(texts) {
  return texts.reduce((sum, text) => sum + text.length, 0)
}
