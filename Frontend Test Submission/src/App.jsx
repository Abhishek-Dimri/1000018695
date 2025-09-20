import { useEffect, useMemo, useState } from 'react'
import './App.css'
import UrlShortener from './components/UrlShortener'
import HistoryList from './components/HistoryList'

function App() {
  const [items, setItems] = useState([])

  // Simple client-side redirect simulation for /r/:slug
  useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/^\/r\/([A-Za-z0-9-_]+)/)
    if (match) {
      const slug = match[1]
      const found = items.find((it) => it.slug === slug)
      if (found) {
        // increment clicks and redirect
        setItems((prev) => prev.map((p) => p.slug === slug ? { ...p, clicks: (p.clicks || 0) + 1 } : p))
        window.location.replace(found.url)
      }
    }
  }, [])

  const handleAdd = (item) => {
    // prevent slug duplicates
    if (items.some((it) => it.slug === item.slug)) {
      alert('Slug already exists in your local list. Choose a different one.')
      return
    }
    setItems((prev) => [item, ...prev])
  }

  const handleOpen = (it) => {
    window.open(it.url, '_blank', 'noopener')
  }

  const handleDelete = (slug) => {
    setItems((prev) => prev.filter((it) => it.slug !== slug))
  }

  return (
    <div className="container">
      <header>
        <h1>URL Shortener</h1>
        <p className="sub">Welcome to the URL Shortener App</p>
      </header>

      <UrlShortener onAdd={handleAdd} />

      <HistoryList items={items} onOpen={handleOpen} onDelete={handleDelete} />

      <footer className="footer">
        <small>
          This demo keeps data in memory only and resets on refresh. No backend connected yet.
        </small>
      </footer>
    </div>
  )
}

export default App
