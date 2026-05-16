import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useSound } from '../hooks/useSound'

export default function CartDrawer({ open, onClose }) {
  const { items, total, updateQty, remove, clear } = useCart()
  const { playClick } = useSound()

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
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-hidden rounded-t-3xl bg-white dark:bg-zinc-950"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <motion.div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800" layout>
              <h2 className="text-lg font-semibold">Your order</h2>
              <button type="button" onClick={onClose} className="p-1">
                <X size={22} />
              </button>
            </motion.div>

            <div className="max-h-[50vh] overflow-y-auto px-5 py-3">
              {items.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">Cart is empty</p>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex gap-3 border-b border-zinc-50 py-3 dark:border-zinc-900"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="h-16 w-16 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-[#e85d04] font-semibold">
                        ${(item.price * item.qty).toFixed(0)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            playClick()
                            updateQty(item.id, item.qty - 1)
                          }}
                          className="rounded-full bg-zinc-100 p-1 dark:bg-zinc-800"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => {
                            playClick()
                            updateQty(item.id, item.qty + 1)
                          }}
                          className="rounded-full bg-zinc-100 p-1 dark:bg-zinc-800"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playClick()
                            remove(item.id)
                          }}
                          className="ml-auto text-zinc-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-zinc-100 px-5 py-4 dark:border-zinc-800">
                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <motion.button
                  type="button"
                  className="w-full rounded-full bg-[#e85d04] py-3.5 text-sm font-semibold text-white"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playClick()
                    alert('Order sent to kitchen! (Demo)')
                    clear()
                    onClose()
                  }}
                >
                  Place order
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
