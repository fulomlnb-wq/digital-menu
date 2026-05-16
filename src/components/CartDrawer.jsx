import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Minus, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useSound } from '../hooks/useSound'
import { submitOrder } from '../utils/order'
import MenuImage from './MenuImage'

export default function CartDrawer({ open, onClose, tableNumber, restaurant }) {
  const { items, total, updateQty, remove, clear } = useCart()
  const { playClick } = useSound()
  const [lastOrder, setLastOrder] = useState(null)

  const handlePlaceOrder = () => {
    playClick()
    const order = submitOrder({
      items,
      total,
      tableNumber,
      restaurant,
    })
    setLastOrder(order)
    clear()
    setTimeout(() => {
      setLastOrder(null)
      onClose()
    }, 2200)
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
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-hidden rounded-t-3xl bg-card"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-default px-5 py-4">
              <h2 className="text-lg font-semibold text-primary">Your order</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-muted"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {lastOrder ? (
              <div className="px-5 py-10 text-center">
                <CheckCircle className="mx-auto text-green-500" size={48} />
                <p className="mt-4 text-lg font-semibold text-primary">Order placed!</p>
                <p className="mt-1 text-sm text-muted">
                  {lastOrder.table
                    ? `Table ${lastOrder.table} · `
                    : ''}
                  ${lastOrder.total.toFixed(2)} · {lastOrder.items.length} item(s)
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-[50vh] overflow-y-auto px-5 py-3 overscroll-contain">
                  {items.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted">Cart is empty</p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 border-b border-default py-3 last:border-0"
                      >
                        <MenuImage
                          item={item}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-primary">{item.name}</p>
                          <p className="text-sm font-semibold text-brand">
                            ${(item.price * item.qty).toFixed(0)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                playClick()
                                updateQty(item.id, item.qty - 1)
                              }}
                              className="rounded-full bg-elevated p-1 text-primary"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center text-sm font-medium text-primary">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                playClick()
                                updateQty(item.id, item.qty + 1)
                              }}
                              className="rounded-full bg-elevated p-1 text-primary"
                              aria-label="Increase quantity"
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
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t border-default px-5 py-4">
                    {tableNumber && (
                      <p className="mb-2 text-center text-xs text-muted">
                        Delivering to Table {tableNumber}
                      </p>
                    )}
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-bold text-primary">${total.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      className="w-full rounded-full bg-[#e85d04] py-3.5 text-sm font-semibold text-white transition active:scale-[0.98]"
                      onClick={handlePlaceOrder}
                    >
                      Place order
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
