/** Parse "Only 2 left" or use explicit stockLimit from menu data */
export function getStockLimit(item) {
  if (item == null) return null
  if (typeof item.stockLimit === 'number' && item.stockLimit >= 0) {
    return item.stockLimit
  }
  const text = item.scarcity || ''
  const match = text.match(/only\s+(\d+)\s+left/i)
  return match ? Number.parseInt(match[1], 10) : null
}

export function getStockMessage(item, maxQty) {
  const limit = maxQty ?? getStockLimit(item)
  if (limit == null) return null
  return `Only ${limit} left — you cannot order more than ${limit}.`
}
