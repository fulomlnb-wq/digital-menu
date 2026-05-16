import { motion } from 'framer-motion'

export default function WelcomeScreen({ restaurant, tableNumber, onComplete }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0b] text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-6 h-20 w-20 rounded-3xl bg-gradient-to-br from-[#e85d04] to-[#ff8c42] shadow-2xl shadow-orange-500/30"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      />
      <motion.h1
        className="text-3xl font-semibold tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {restaurant.name}
      </motion.h1>
      <motion.p
        className="mt-2 text-sm text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {restaurant.tagline}
      </motion.p>
      {tableNumber && (
        <motion.p
          className="mt-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          Table {tableNumber}
        </motion.p>
      )}
      <motion.button
        type="button"
        className="mt-10 text-sm text-white/50 underline-offset-4 hover:text-white/80 hover:underline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onComplete}
      >
        Skip
      </motion.button>
    </motion.div>
  )
}
