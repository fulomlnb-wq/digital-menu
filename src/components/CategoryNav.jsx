import { motion } from 'framer-motion'
import { useSound } from '../hooks/useSound'

export default function CategoryNav({ categories, active, onChange }) {
  const { playClick } = useSound()

  return (
    <nav className="hide-scrollbar flex gap-2 overflow-x-auto px-4 pb-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => {
            playClick()
            onChange(cat.id)
          }}
          className="relative shrink-0"
        >
          {active === cat.id && (
            <motion.div
              layoutId="category-pill"
              className="absolute inset-0 rounded-full bg-[#e85d04]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
              active === cat.id
                ? 'text-white'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </span>
        </button>
      ))}
    </nav>
  )
}
