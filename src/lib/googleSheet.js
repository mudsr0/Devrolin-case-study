const SHEET_FIELDS = ['clientName', 'skills', 'techStack', 'description']
const WEBHOOK_TIMEOUT_MS = 10000

export function normalizeSheetData(source) {
  return SHEET_FIELDS.reduce((acc, field) => {
    acc[field] = String(source?.[field] ?? '').trim()
    return acc
  }, {})
}

export function hasSheetData(source) {
  const values = normalizeSheetData(source)
  return SHEET_FIELDS.some((field) => values[field].length > 0)
}

export function sheetDataChanged(previous, next) {
  const prev = normalizeSheetData(previous)
  const curr = normalizeSheetData(next)
  return SHEET_FIELDS.some((field) => prev[field] !== curr[field])
}

export async function sendToGoogleSheet(sheetData, slug) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[googleSheet] Skipped: GOOGLE_SHEET_WEBHOOK_URL is not set')
    return false
  }
  if (!hasSheetData(sheetData)) {
    console.warn('[googleSheet] Skipped: all sheetData fields are empty')
    return false
  }

  const values = normalizeSheetData(sheetData)

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: String(slug ?? '').trim(),
        clientName: values.clientName,
        skills: values.skills,
        techStack: values.techStack,
        description: values.description,
      }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    })

    const body = await res.text()

    if (!res.ok) {
      console.error(
        `[googleSheet] Webhook returned ${res.status} ${res.statusText}. ` +
          'Check that the Apps Script is deployed as a web app with ' +
          'execute access set to "Anyone". Response: ' +
          body.slice(0, 200)
      )
      return false
    }

    if (res.redirected) {
      console.warn(
        `[googleSheet] Webhook redirected to ${res.url}. The script is likely ` +
          'not shared publicly — set execute access to "Anyone".'
      )
    }

    console.log(`[googleSheet] Delivered (${res.status}): ${body.slice(0, 200)}`)
    return true
  } catch (sheetError) {
    console.error('Failed to send data to Google Sheet:', sheetError)
    // Don't block the API response if the sheet fails
    return false
  }
}
