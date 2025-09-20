export default function HistoryList({ items = [], onOpen, onDelete }) {
  if (!items.length) {
    return (
      <div className="card">
        <h3>History</h3>
        <p>No links yet. Create one above.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>History</h3>
      <ul className="history">
        {items.map((it) => (
          <li key={it.slug} className="row">
            <div className="col">
              <div className="short">
                <a href={it.shortUrl} onClick={(e) => { e.preventDefault(); onOpen?.(it) }}>
                  {it.shortUrl}
                </a>
              </div>
              <div className="long" title={it.url}>{it.url}</div>
              <div className="meta">Created {new Date(it.createdAt).toLocaleString()} · Clicks {it.clicks ?? 0}</div>
            </div>
            <div className="col actions">
              <button onClick={() => onOpen?.(it)}>Open</button>
              <button className="danger" onClick={() => onDelete?.(it.slug)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
