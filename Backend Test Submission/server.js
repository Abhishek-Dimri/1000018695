import { createApp } from './src/app.js'

const PORT = process.env.PORT || 4000
const app = createApp()

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
