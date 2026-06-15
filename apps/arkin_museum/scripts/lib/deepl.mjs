const DEFAULT_API_URL = "https://api-free.deepl.com"

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
 * @returns {Promise<string[]>}
 */
export async function translateTexts(texts, { apiKey, apiUrl = DEFAULT_API_URL }) {
  if (texts.length === 0) return []

  const response = await fetch(`${apiUrl}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      source_lang: "EN",
      target_lang: "TR",
    }),
  })

  const body = await response.text()
  if (!response.ok) {
    throw new Error(`DeepL translate failed: ${response.status} ${body}`)
  }

  const data = JSON.parse(body)
  return data.translations.map((item) => item.text)
}

export function countCharacters(texts) {
  return texts.reduce((sum, text) => sum + text.length, 0)
}
