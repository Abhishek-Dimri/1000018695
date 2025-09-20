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

export default function UrlShortener({ onCreate, shortBase }) {
  const [url, setUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const base = useMemo(() => {
    // Preview against backend redirect base
    if (shortBase) return shortBase.endsWith('/') ? shortBase : shortBase + '/'
    return `${window.location.origin}/r/`
  }, [shortBase])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL starting with http or https.')
      return
    }

    const slug = customSlug.trim()
    if (slug && !/^[a-zA-Z0-9-_]+$/.test(slug)) {
      setError('Slug may contain letters, numbers, dash or underscore only.')
      return
    }

    try {
      setBusy(true)
      await onCreate?.({ url, slug: slug || undefined })
      setUrl('')
      setCustomSlug('')
    } catch (err) {
      setError(err?.message || 'Failed to create short link')
    } finally {
      setBusy(false)
    }
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
  <h2>Create a short URL</h2>
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
          <button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create short link'}</button>
          {customSlug && (
            <button type="button" onClick={() => handleCopy(base + customSlug)}>
              {copied ? 'Copied!' : 'Copy preview'}
            </button>
          )}
        </div>

        {error && <p className="error">{error}</p>}
      </form>

      <p className="hint">Backend: {base.replace(/\/$/, '')}</p>
    </div>
  )
}
