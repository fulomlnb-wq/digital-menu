export const KEYS = {
  orders: 'smart-menu-orders',
  reviews: 'smart-menu-reviews',
  menu: 'smart-menu-data',
  adminSession: 'smart-menu-admin',
}

export function loadJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveJson(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}
