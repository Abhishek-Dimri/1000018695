const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

async function http(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let err = 'Request failed'
    try {
      const data = await res.json()
      err = data.error || JSON.stringify(data)
    } catch {}
    throw new Error(err)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export const api = {
  base: API_BASE,
  shorten: (payload) => http('POST', '/api/shorten', payload),
  list: () => http('GET', '/api/links'),
  remove: (slug) => http('DELETE', `/api/links/${encodeURIComponent(slug)}`),
}
