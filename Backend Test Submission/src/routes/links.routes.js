import { Router } from 'express'
import { health, redirect, shorten, list, remove, createShortUrl, getShortUrlStats } from '../controllers/links.controller.js'

const router = Router()

router.get('/health', health)
router.post('/api/shorten', shorten)
router.get('/api/links', list)
router.delete('/api/links/:slug', remove)
router.get('/r/:slug', redirect)
// New endpoints per spec
router.post('/shorturls', createShortUrl)
router.get('/shorturls/:shortcode', getShortUrlStats)

export default router
