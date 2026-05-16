/**
 * Persists order payload (demo). Includes table from ?table= URL when present.
 */
export function submitOrder({ items, total, tableNumber, restaurant }) {
  const order = {
    id: `ord-${Date.now()}`,
    table: tableNumber ? String(tableNumber) : null,
    restaurant: restaurant?.name || 'Restaurant',
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      qty: i.qty,
      price: i.price,
      lineTotal: i.price * i.qty,
    })),
    total: Number(total.toFixed(2)),
    createdAt: new Date().toISOString(),
  }

  try {
    const key = 'smart-menu-orders'
    const prev = JSON.parse(localStorage.getItem(key) || '[]')
    prev.push(order)
    localStorage.setItem(key, JSON.stringify(prev))
  } catch {
    /* storage full or private mode */
  }

  return order
}
