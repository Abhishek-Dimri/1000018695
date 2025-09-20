import { useEffect, useMemo, useState } from 'react'

const isValidUrl = (value) => {
  try {
    // Accepts http(s) and optional path/query/hash
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

const randomSlug = (len = 6) =>
  Array.from({ length: len }, () =>
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      .charAt(Math.floor(Math.random() * 62))
  ).join('')

export default function UrlShortener({ onAdd }) {
  const [url, setUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const base = useMemo(() => {
    // Frontend-only: use current origin as display base
    return `${window.location.origin}/r/`
  }, [])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL starting with http or https.')
      return
    }

    const slug = (customSlug || randomSlug()).trim()
    if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
      setError('Slug may contain letters, numbers, dash or underscore only.')
      return
    }

    const item = {
      slug,
      url,
      shortUrl: base + slug,
      createdAt: new Date().toISOString(),
      clicks: 0,
    }

    onAdd?.(item)
    setUrl('')
    setCustomSlug('')
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }

  return (
    <div className="card">
      <h2>Basic URL Shortener (frontend only)</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          <span>Destination URL</span>
          <input
            type="url"
            placeholder="https://example.com/some/long/path"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Custom slug (optional)</span>
          <input
            type="text"
            placeholder="e.g. my-link"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
          />
        </label>

        <div className="actions">
          <button type="submit">Create short link</button>
          {customSlug && (
            <button type="button" onClick={() => handleCopy(base + customSlug)}>
              {copied ? 'Copied!' : 'Copy preview'}
            </button>
          )}
        </div>

        {error && <p className="error">{error}</p>}
      </form>

      <p className="hint">
        Note: This is a frontend-only demo. Links are not persisted to a server and redirecting is simulated.
      </p>
    </div>
  )
}
