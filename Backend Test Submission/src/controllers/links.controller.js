import { customAlphabet } from 'nanoid'
import * as store from '../store/linksStore.js'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const nanoid = customAlphabet(alphabet, 7)

export const health = (req, res) => {
  res.json({ status: 'ok' })
}

export const shorten = (req, res) => {
  const { url, slug } = req.body || {}
  try {
    const u = new URL(url)
    if (!/^https?:$/.test(u.protocol)) throw new Error('Invalid protocol')
  } catch {
    return res.status(400).json({ error: 'Invalid URL. Must start with http or https.' })
  }

  const id = (slug || nanoid()).trim()
  if (!/^[A-Za-z0-9-_]+$/.test(id)) {
    return res.status(400).json({ error: 'Slug may contain letters, numbers, dash or underscore only.' })
  }
  if (store.has(id) && slug) {
    return res.status(409).json({ error: 'Slug already exists' })
  }

  const created = store.get(id) || { url, createdAt: new Date().toISOString(), clicks: 0 }
  created.url = url
  // keep existing fields if present
  created.expiresAt = created.expiresAt || null
  created.clickDetails = created.clickDetails || []
  store.set(id, created)

  res.status(201).json({
    slug: id,
    url: created.url,
    shortUrl: `${req.protocol}://${req.get('host')}/r/${id}`,
    createdAt: created.createdAt,
    clicks: created.clicks,
  })
}

export const list = (req, res) => {
  const arr = store.list().map((it) => ({
    ...it,
    shortUrl: `${req.protocol}://${req.get('host')}/r/${it.slug}`,
  }))
  arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(arr)
}

export const remove = (req, res) => {
  const { slug } = req.params
  if (!store.has(slug)) return res.status(404).json({ error: 'Not found' })
  store.del(slug)
  res.status(204).end()
}

export const redirect = (req, res) => {
  const { slug } = req.params
  const found = store.get(slug)
  if (!found) return res.status(404).send('Not found')
  // Check expiry
  if (found.expiresAt && new Date(found.expiresAt).getTime() <= Date.now()) {
    return res.status(410).send('Link expired')
  }
  // Record click details
  const ip = (req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip || '').trim()
  const detail = {
    timestamp: new Date().toISOString(),
    referer: req.get('referer') || null,
    userAgent: req.get('user-agent') || null,
    ip: ip || null,
    geo: null, // Not resolved in this implementation
  }
  found.clicks = (found.clicks || 0) + 1
  found.clickDetails = found.clickDetails || []
  found.clickDetails.push(detail)
  res.redirect(found.url)
}

// New API: Create short URL with optional validity and custom shortcode
export const createShortUrl = (req, res) => {
  const { url, validity, shortcode } = req.body || {}
  // Validate URL
  try {
    const u = new URL(url)
    if (!/^https?:$/.test(u.protocol)) throw new Error('Invalid protocol')
  } catch {
    return res.status(400).json({ error: 'Invalid URL. Must start with http or https.' })
  }

  const minutes = Number.isFinite(Number(validity)) ? Math.max(1, Number(validity)) : 30
  const id = (shortcode || nanoid()).trim()
  if (!/^[A-Za-z0-9-_]+$/.test(id)) {
    return res.status(400).json({ error: 'Shortcode may contain letters, numbers, dash or underscore only.' })
  }
  if (store.has(id) && shortcode) {
    return res.status(409).json({ error: 'Shortcode already exists' })
  }

  const now = Date.now()
  const expiresAt = new Date(now + minutes * 60 * 1000).toISOString()
  const existing = store.get(id)
  const data = existing || { createdAt: new Date(now).toISOString(), clicks: 0, clickDetails: [] }
  data.url = url
  data.expiresAt = expiresAt
  store.set(id, data)

  return res.status(201).json({
    shortLink: `${req.protocol}://${req.get('host')}/r/${id}`,
    expiry: expiresAt,
  })
}

// New API: Get statistics for a given shortcode
export const getShortUrlStats = (req, res) => {
  const { shortcode } = req.params
  const found = store.get(shortcode)
  if (!found) return res.status(404).json({ error: 'Not found' })
  const body = {
    shortcode,
    url: found.url,
    createdAt: found.createdAt,
    expirationDate: found.expiresAt || null,
    clicks: found.clicks || 0,
    clickDetails: found.clickDetails || [],
  }
  return res.json(body)
}
