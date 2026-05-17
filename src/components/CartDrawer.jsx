import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Minus, Plus, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useMenu } from '../context/MenuContext'
import { useSound } from '../hooks/useSound'
import { calculateOrderTotals } from '../utils/pricing'
import { submitOrder } from '../utils/order'
import { getStockLimit } from '../utils/stock'
import MenuImage from './MenuImage'
import PriceBreakdown from './PriceBreakdown'
import ReviewForm from './ReviewForm'

export default function CartDrawer({ open, onClose, urlTableNumber }) {
  const { items, total, updateQty, remove, clear, lastError } = useCart()
  const { settings, restaurant } = useMenu()
  const { playClick } = useSound()

  const [orderType, setOrderType] = useState('eat-in')
  const [tableInput, setTableInput] = useState(urlTableNumber || '')
  const [formError, setFormError] = useState('')
  const [lastOrder, setLastOrder] = useState(null)

  const pricing = useMemo(
    () => calculateOrderTotals(total, settings),
    [total, settings]
  )

  const currency = settings.currencySymbol || '$'

  const handlePlaceOrder = () => {
    setFormError('')
    const table = tableInput.trim()

    if (orderType === 'eat-in' && !table) {
      setFormError('Table number is required for Eat Here orders.')
      return
    }

    playClick()
    const order = submitOrder({
      items,
      subtotal: total,
      settings,
      tableNumber: orderType === 'eat-in' ? table : null,
      orderType,
      restaurant,
      pricing,
    })
    setLastOrder(order)
    clear()
  }

  const handleClose = () => {
    setLastOrder(null)
    setFormError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[90vh] flex-col overflow-hidden rounded-t-3xl bg-card"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-default px-5 py-4">
              <h2 className="text-lg font-semibold text-primary">Your order</h2>
              <button type="button" onClick={handleClose} className="p-1 text-muted" aria-label="Close">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3">
              {lastOrder ? (
                <div className="py-6 text-center">
                  <CheckCircle className="mx-auto text-green-500" size={48} />
                  <p className="mt-4 text-lg font-semibold text-primary">Order placed!</p>
                  <p className="mt-1 text-sm text-muted">
                    {lastOrder.orderType === 'eat-in' && lastOrder.table
                      ? `Table ${lastOrder.table} · `
                      : ''}
                    {lastOrder.orderType === 'takeaway' ? 'Takeaway · ' : ''}
                    {currency}
                    {lastOrder.total.toFixed(2)}
                  </p>
                  <ReviewForm orderId={lastOrder.id} />
                </div>
              ) : items.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">Cart is empty</p>
              ) : (
                <>
                  {items.map((item) => {
                    const limit = getStockLimit(item)
                    const atMax = limit != null && item.qty >= limit
                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 border-b border-default py-3 last:border-0"
                      >
                        <MenuImage item={item} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-primary">{item.name}</p>
                          <p className="text-sm font-semibold text-brand">
                            {currency}
                            {(item.price * item.qty).toFixed(2)}
                          </p>
                          {limit != null && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400">
                              Max {limit} per order
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                playClick()
                                updateQty(item.id, item.qty - 1)
                              }}
                              className="rounded-full bg-elevated p-1 text-primary"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center text-sm font-medium text-primary">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              disabled={atMax}
                              onClick={() => {
                                playClick()
                                updateQty(item.id, item.qty + 1)
                              }}
                              className="rounded-full bg-elevated p-1 text-primary disabled:opacity-40"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                playClick()
                                remove(item.id)
                              }}
                              className="ml-auto text-muted"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  <div className="mt-4 space-y-3 border-t border-default pt-4">
                    <p className="text-sm font-medium text-primary">Order type</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'eat-in', label: 'Eat Here' },
                        { id: 'takeaway', label: 'Takeaway' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            playClick()
                            setOrderType(opt.id)
                            setFormError('')
                          }}
                          className={`rounded-xl border py-2.5 text-sm font-medium transition ${
                            orderType === opt.id
                              ? 'border-[#e85d04] bg-[#e85d04]/10 text-brand'
                              : 'border-default bg-elevated text-muted'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label htmlFor="table-num" className="mb-1 block text-sm font-medium text-primary">
                        Table number {orderType === 'eat-in' && <span className="text-brand">*</span>}
                      </label>
                      <input
                        id="table-num"
                        type="text"
                        inputMode="numeric"
                        placeholder={orderType === 'eat-in' ? 'e.g. 5' : 'Optional'}
                        value={tableInput}
                        onChange={(e) => setTableInput(e.target.value)}
                        className="w-full rounded-xl border border-default bg-input px-3 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:border-[#e85d04]"
                      />
                    </div>

                    <PriceBreakdown pricing={pricing} currencySymbol={currency} />

                    {(formError || lastError) && (
                      <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                        {formError || lastError}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && !lastOrder && (
              <div className="shrink-0 border-t border-default px-5 py-4">
                <button
                  type="button"
                  className="w-full rounded-full bg-[#e85d04] py-3.5 text-sm font-semibold text-white transition active:scale-[0.98]"
                  onClick={handlePlaceOrder}
                >
                  Place order · {currency}
                  {pricing.total.toFixed(2)}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
