import { calculateOrderTotals } from './pricing'
import { KEYS, loadJson, saveJson } from './storage'

export function getOrders() {
  return loadJson(KEYS.orders, [])
}

export function submitOrder({
  items,
  subtotal,
  settings,
  tableNumber,
  orderType,
  restaurant,
  pricing,
}) {
  const breakdown = pricing || calculateOrderTotals(subtotal, settings)

  const order = {
    id: `ord-${Date.now()}`,
    table: tableNumber ? String(tableNumber).trim() : null,
    orderType: orderType || 'eat-in',
    restaurant: restaurant?.name || 'Restaurant',
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      qty: i.qty,
      price: i.price,
      lineTotal: i.price * i.qty,
    })),
    subtotal: breakdown.subtotal,
    vat: breakdown.vat,
    serviceCharge: breakdown.serviceCharge,
    additionalTax: breakdown.additionalTax,
    total: breakdown.total,
    createdAt: new Date().toISOString(),
  }

  const prev = getOrders()
  prev.push(order)
  saveJson(KEYS.orders, prev)

  return order
}

export function getWeeklySales() {
  const orders = getOrders()
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const totals = Object.fromEntries(days.map((d) => [d, 0]))

  for (const order of orders) {
    const date = new Date(order.createdAt)
    if (date < weekAgo) continue
    const day = days[date.getDay()]
    totals[day] += order.total || 0
  }

  return days.map((day) => ({ day, total: totals[day] }))
}
