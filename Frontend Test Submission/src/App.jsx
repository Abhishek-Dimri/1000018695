import { useEffect, useState } from 'react'
import './App.css'
import UrlShortener from './components/UrlShortener'
import HistoryList from './components/HistoryList'
import { api } from './api'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load initial list from backend
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const list = await api.list()
        if (alive) setItems(list)
      } catch (e) {
        if (alive) setError(e?.message || 'Failed to load links')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const handleCreate = async ({ url, slug }) => {
    setError('')
    const created = await api.shorten({ url, slug })
    setItems((prev) => {
      const filtered = prev.filter((p) => p.slug !== created.slug)
      return [created, ...filtered]
    })
  }

  const handleOpen = async (it) => {
    // Optimistically increment locally for immediate UX
    setItems((prev) => prev.map((p) => p.slug === it.slug ? { ...p, clicks: (p.clicks ?? 0) + 1 } : p))
    // Open backend short URL to increment real count
    window.open(it.shortUrl, '_blank', 'noopener')
    // After a brief delay, pull latest counts from backend
    setTimeout(async () => {
      try {
        const list = await api.list()
        setItems(list)
      } catch {}
    }, 600)
  }

  const handleDelete = async (slug) => {
    setError('')
    try {
      await api.remove(slug)
      setItems((prev) => prev.filter((it) => it.slug !== slug))
    } catch (e) {
      setError(e?.message || 'Failed to delete link')
    }
  }

  return (
    <div className="container">
      <header>
        <h1>URL Shortener</h1>
        <p className="sub">Frontend + Backend demo (API at {api.base})</p>
      </header>

      {error && (
        <div className="card"><p className="error">{error}</p></div>
      )}

      <UrlShortener onCreate={handleCreate} shortBase={`${api.base}/r/`} />

      {!loading && (
        <HistoryList items={items} onOpen={handleOpen} onDelete={handleDelete} />
      )}

      <footer className="footer">
        <small>
          Backend stores data in memory only and resets on server restart.
        </small>
      </footer>
    </div>
  )
}

export default App
