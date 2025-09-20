const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const API_LOG = import.meta.env.VITE_API_LOG ?? (import.meta.env.DEV ? '1' : '')

async function http(method, path, body) {
  const url = `${API_BASE}${path}`
  const start = performance.now()
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const ms = Math.round(performance.now() - start)
  if (!res.ok) {
    let err = 'Request failed'
    try {
      const data = await res.json()
      err = data.error || JSON.stringify(data)
    } catch {}
    if (API_LOG) console.warn(`[api] ${method} ${url} -> ${res.status} (${ms}ms) error=${err}`)
    throw new Error(err)
  }
  const ct = res.headers.get('content-type') || ''
  const out = ct.includes('application/json') ? await res.json() : await res.text()
  if (API_LOG) console.log(`[api] ${method} ${url} -> ${res.status} (${ms}ms)`, out)
  return out
}

export const api = {
  base: API_BASE,
  shorten: (payload) => http('POST', '/api/shorten', payload),
  list: () => http('GET', '/api/links'),
  remove: (slug) => http('DELETE', `/api/links/${encodeURIComponent(slug)}`),
}
