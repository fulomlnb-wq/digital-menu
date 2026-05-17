import { memo } from 'react'
import { formatMoney } from '../utils/pricing'

function PriceBreakdown({ pricing, currencySymbol = '$' }) {
  if (!pricing) return null
  const fmt = (n) => formatMoney(n, currencySymbol)

  return (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between text-muted">
        <span>Subtotal</span>
        <span className="font-medium text-primary">{fmt(pricing.subtotal)}</span>
      </div>
      <div className="flex justify-between text-muted">
        <span>VAT ({pricing.vatPercent}%)</span>
        <span className="font-medium text-primary">{fmt(pricing.vat)}</span>
      </div>
      <div className="flex justify-between text-muted">
        <span>Service charge ({pricing.serviceChargePercent}%)</span>
        <span className="font-medium text-primary">{fmt(pricing.serviceCharge)}</span>
      </div>
      {pricing.taxPercent > 0 && (
        <div className="flex justify-between text-muted">
          <span>Additional tax ({pricing.taxPercent}%)</span>
          <span className="font-medium text-primary">{fmt(pricing.additionalTax)}</span>
        </div>
      )}
      <div className="flex justify-between border-t border-default pt-2 text-base font-bold">
        <span className="text-primary">Total</span>
        <span className="text-brand">{fmt(pricing.total)}</span>
      </div>
    </div>
  )
}

export default memo(PriceBreakdown)
