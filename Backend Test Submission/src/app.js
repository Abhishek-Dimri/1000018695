import express from 'express'
import cors from 'cors'
import routes from './routes/links.routes.js'

export function createApp() {
  const app = express()
  const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000'

  // Trust reverse proxy headers for IP detection
  app.set('trust proxy', true)

  app.use(cors({ origin: FRONTEND_ORIGIN }))
  app.use(express.json())
  app.use(routes)

  return app
}
