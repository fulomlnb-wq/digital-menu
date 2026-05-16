import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartButton({ onClick }) {
  const { count, total } = useCart()

  if (count === 0) return null

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-zinc-900 px-5 py-3.5 text-white shadow-2xl dark:bg-white dark:text-zinc-900"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileTap={{ scale: 0.96 }}
      layout
    >
      <div className="relative">
        <ShoppingBag size={22} />
        <motion.span
          key={count}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#e85d04] text-[10px] font-bold text-white"
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
        >
          {count}
        </motion.span>
      </div>
      <span className="text-sm font-semibold">View order</span>
      <span className="text-sm font-bold">${total.toFixed(0)}</span>
    </motion.button>
  )
}
