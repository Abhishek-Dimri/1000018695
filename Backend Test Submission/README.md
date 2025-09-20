# Backend Test Submission

A minimal Node/Express URL shortener API with in-memory storage (no database).

## Requirements
- Node.js 18+

## Install & Run
```powershell
cd "Backend Test Submission"
npm install
npm start
# Server runs on http://localhost:4000
```

If you want auto-reload while developing:
```powershell
npm run dev
```

## Endpoints
- `GET /health` — Health check
- `POST /api/shorten` — Create a short link
  - Body JSON: `{ "url": "https://example.com", "slug": "optional-custom" }`
  - If `slug` is omitted, a random one is generated
- `GET /api/links` — List all links
- `DELETE /api/links/:slug` — Delete a link
- `GET /r/:slug` — Redirect to the original URL and increment click count

All data is in-memory and resets on server restart.

CORS is enabled for `http://localhost:3000` by default (configurable via `FRONTEND_ORIGIN` env var).

## Quick test (PowerShell)
Health:
```powershell
Invoke-RestMethod -Uri http://localhost:4000/health | ConvertTo-Json -Compress
```

Create:
```powershell
Invoke-RestMethod -Method Post `
  -Uri http://localhost:4000/api/shorten `
  -ContentType 'application/json' `
  -Body '{"url":"https://example.com","slug":"demo"}' | ConvertTo-Json -Compress
```

List:
```powershell
Invoke-RestMethod -Uri http://localhost:4000/api/links | ConvertTo-Json -Compress
```

Delete:
```powershell
Invoke-RestMethod -Method Delete -Uri http://localhost:4000/api/links/demo -SkipHttpErrorCheck:$true
```

Redirect in browser:
```powershell
Start-Process http://localhost:4000/r/demo
```

## Environment variables (optional)
- `PORT` (default `4000`)
- `FRONTEND_ORIGIN` (default `http://localhost:3000`)
