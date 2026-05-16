import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function DailySpecials({ special, onSelect }) {
  if (!special) return null

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="mx-4 mb-4 w-[calc(100%-2rem)] overflow-hidden rounded-2xl bg-gradient-to-r from-[#e85d04] to-[#dc2f02] p-4 text-left text-white shadow-lg shadow-orange-500/25"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 bg-white/10"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        style={{ width: '50%' }}
      />
      <motion.div
        className="relative flex items-start gap-3"
        animate={{ scale: [1, 1.01, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Sparkles className="mt-0.5 shrink-0" size={20} />
        <motion.div>
          <p className="text-xs font-medium uppercase tracking-wider opacity-90">
            Daily Special
          </p>
          <p className="mt-1 text-base font-semibold">{special.title}</p>
          <p className="mt-0.5 text-sm opacity-90">{special.description}</p>
          {special.discount && (
            <span className="mt-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
              {special.discount}
            </span>
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}
