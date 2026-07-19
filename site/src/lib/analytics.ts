declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void }
  }
}

export const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID?.trim() || null

// Never let a blocked or missing analytics script break a click — the link must still
// navigate, so this stays fire-and-forget.
export function track(event: string, data?: Record<string, unknown>) {
  window.umami?.track(event, data)
}
