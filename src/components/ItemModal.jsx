import { motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { memo, useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useSound } from '../hooks/useSound'
import { getStockLimit, getStockMessage } from '../utils/stock'
import Food3DPreview from './Food3DPreview'

function ItemModal({ item, onClose, onAdd }) {
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const { items: cartItems } = useCart()
  const { playAdd, playClick } = useSound()

  const limit = useMemo(() => getStockLimit(item), [item])
  const inCart = cartItems.find((i) => i.id === item.id)?.qty || 0
  const maxCanAdd = limit != null ? Math.max(0, limit - inCart) : 99

  if (!item) return null

  const isHealthy = item.tags?.includes('healthy') || item.tags?.includes('vegan')

  const changeQty = (delta) => {
    setQty((q) => {
      const next = q + delta
      if (next < 1) return 1
      if (limit != null && inCart + next > limit) {
        setError(getStockMessage(item, limit))
        return Math.min(next, maxCanAdd)
      }
      setError('')
      return limit != null ? Math.min(next, maxCanAdd) : next
    })
  }

  const handleAdd = () => {
    if (limit != null && inCart + qty > limit) {
      setError(getStockMessage(item, limit))
      return
    }
    playAdd()
    const result = onAdd ? onAdd(item, qty) : null
    if (result && !result.ok) {
      setError(result.message)
      return
    }
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-5 sm:rounded-3xl"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        <button
          type="button"
          onClick={() => {
            playClick()
            onClose()
          }}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <Food3DPreview item={item} />

        <div className="mt-4">
          {item.popular && (
            <span className="mb-2 inline-block rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
              Most Popular
            </span>
          )}
          <h2 className="text-xl font-semibold text-primary">{item.name}</h2>
          <p className="mt-1 text-sm text-muted">{item.description}</p>

          {item.socialProof && (
            <p className="mt-2 text-xs font-medium text-muted">{item.socialProof}</p>
          )}
          {item.scarcity && (
            <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {item.scarcity}
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            {item.anchorPrice > item.price && (
              <span className="text-sm text-muted line-through">${item.anchorPrice}</span>
            )}
            <span
              className={`text-2xl font-bold ${
                isHealthy ? 'text-green-600 dark:text-green-400' : 'text-brand'
              }`}
            >
              ${item.price}
            </span>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 rounded-full bg-elevated px-2 py-1">
              <button
                type="button"
                onClick={() => {
                  playClick()
                  changeQty(-1)
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-primary shadow"
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-semibold text-primary">{qty}</span>
              <button
                type="button"
                disabled={limit != null && qty >= maxCanAdd}
                onClick={() => {
                  playClick()
                  changeQty(1)
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-primary shadow disabled:opacity-40"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={maxCanAdd < 1}
              className="flex-1 rounded-full bg-[#e85d04] py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition active:scale-[0.97] disabled:opacity-50"
            >
              {maxCanAdd < 1 ? 'Sold out' : `Add · $${(item.price * qty).toFixed(0)}`}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default memo(ItemModal)
