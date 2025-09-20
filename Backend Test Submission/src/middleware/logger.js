export function requestLogger(req, res, next) {
  const start = Date.now()
  const { method, originalUrl } = req
  const ip = (req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip || '').trim()

  res.on('finish', () => {
    const ms = Date.now() - start
    const status = res.statusCode
    const ua = req.get('user-agent') || ''
    // Minimal, structured-ish log
    console.log(`[req] ${method} ${originalUrl} ${status} ${ms}ms ip=${ip} ua="${ua.substring(0, 80)}"`)
  })

  next()
}
