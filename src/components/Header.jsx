import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { memo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useSound } from '../hooks/useSound'

function Header({ restaurant, tableNumber }) {
  const { isDark, toggle } = useTheme()
  const { playClick } = useSound()

  return (
    <header className="glass sticky top-0 z-40 border-b border-default">
      <motion.div
        className="mx-auto flex max-w-lg items-center justify-between px-4 py-4"
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-primary">
            {restaurant.name}
          </h1>
          {tableNumber && (
            <p className="text-xs text-muted">Table {tableNumber}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            playClick()
            toggle()
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition hover:scale-105 active:scale-95"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </motion.div>
    </header>
  )
}

export default memo(Header)
