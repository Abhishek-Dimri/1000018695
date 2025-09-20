// In-memory link store
// slug -> { url, createdAt, clicks }
const links = new Map()

export function has(slug) {
  return links.has(slug)
}

export function get(slug) {
  return links.get(slug)
}

export function set(slug, data) {
  links.set(slug, data)
}

export function del(slug) {
  return links.delete(slug)
}

export function list() {
  return Array.from(links.entries()).map(([slug, data]) => ({ slug, ...data }))
}

export function clear() {
  links.clear()
}
