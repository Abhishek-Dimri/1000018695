# Backend structure

```
Backend Test Submission/
  server.js                # Entry point: creates server using src/app
  src/
    app.js                 # Express app setup (middleware & routes)
    routes/
      links.routes.js      # Routes for health, links, redirect
    controllers/
      links.controller.js  # Handlers for shorten/list/remove/redirect/health
    store/
      linksStore.js        # In-memory Map store
```

Notes:
- Storage is in-memory and resets when the process restarts.
- CORS allows `http://localhost:3000` by default. Configure via `FRONTEND_ORIGIN` env var.
- `PORT` defaults to `4000`.
