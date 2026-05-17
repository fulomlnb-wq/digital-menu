export function calculateOrderTotals(subtotal, settings = {}) {
  const vatPercent = settings.vatPercent ?? 12
  const serviceChargePercent = settings.serviceChargePercent ?? 10
  const taxPercent = settings.taxPercent ?? 0

  const vat = (subtotal * vatPercent) / 100
  const serviceCharge = (subtotal * serviceChargePercent) / 100
  const additionalTax = (subtotal * taxPercent) / 100
  const total = subtotal + vat + serviceCharge + additionalTax

  return {
    subtotal,
    vat,
    serviceCharge,
    additionalTax,
    total,
    vatPercent,
    serviceChargePercent,
    taxPercent,
  }
}

export function formatMoney(amount, symbol = '$') {
  return `${symbol}${amount.toFixed(2)}`
}
