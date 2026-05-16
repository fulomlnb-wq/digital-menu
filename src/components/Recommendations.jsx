import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useSound } from '../hooks/useSound'

export default function Recommendations({ items, onAdd, onOpen }) {
  const { playAdd } = useSound()

  if (!items?.length) return null

  return (
    <section className="px-4 pb-6">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="text-[#e85d04]" size={18} />
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
          You might also like…
        </h2>
      </div>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => onOpen(item)}
            className="w-36 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-white text-left dark:border-zinc-800 dark:bg-zinc-900"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
          >
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="h-24 w-full object-cover"
            />
            <div className="p-2">
              <p className="line-clamp-1 text-xs font-medium">{item.name}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-[#e85d04]">${item.price}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    playAdd()
                    onAdd(item)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && onAdd(item)}
                  className="rounded-full bg-[#e85d04] px-2 py-0.5 text-[10px] text-white"
                >
                  Add
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
