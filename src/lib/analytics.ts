type AnalyticsPayload = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export function trackEvent(name: string, payload: AnalyticsPayload = {}) {
  window.dispatchEvent(new CustomEvent('personweb:analytics', {
    detail: { name, ...payload },
  }))
  window.dataLayer?.push({ event: name, ...payload })
}
