import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useSound } from '../hooks/useSound'

export default function Header({ restaurant, tableNumber }) {
  const { isDark, toggle } = useTheme()
  const { playClick } = useSound()

  return (
    <header className="glass sticky top-0 z-40 border-b border-black/5 dark:border-white/10">
      <motion.div
        className="mx-auto flex max-w-lg items-center justify-between px-4 py-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
            {restaurant.name}
          </h1>
          {tableNumber && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Table {tableNumber}</p>
          )}
        </motion.div>
        <button
          type="button"
          onClick={() => {
            playClick()
            toggle()
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition hover:scale-105 active:scale-95 dark:bg-zinc-800 dark:text-zinc-200"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </motion.div>
    </header>
  )
}
