import { motion } from 'framer-motion'
import { Flame, Plus } from 'lucide-react'
import { useSound } from '../hooks/useSound'

const tagStyles = {
  spicy: 'bg-red-500/15 text-red-600 dark:text-red-400',
  vegan: 'bg-green-500/15 text-green-700 dark:text-green-400',
  popular: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  healthy: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
}

export default function MenuCard({ item, index, onOpen, onAdd }) {
  const { playAdd } = useSound()
  const isHealthy = item.tags?.includes('healthy') || item.tags?.includes('vegan')

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md dark:bg-zinc-900 ${
        item.popular
          ? 'border-orange-300/60 ring-1 ring-orange-400/30 dark:border-orange-500/40'
          : 'border-zinc-100 dark:border-zinc-800'
      } ${isHealthy ? 'ring-1 ring-green-500/20' : ''}`}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(item)}
    >
      {item.popular && (
        <motion.div
          className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e85d04] to-[#dc2f02] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <Flame size={10} />
          Most Popular
        </motion.div>
      )}

      <motion.div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {item.scarcity && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-sm">
            {item.scarcity}
          </span>
        )}
      </motion.div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-900 dark:text-white">{item.name}</h3>
          <div className="text-right">
            {item.anchorPrice > item.price && (
              <span className="block text-[10px] text-zinc-400 line-through">
                ${item.anchorPrice}
              </span>
            )}
            <span
              className={`text-sm font-bold ${
                isHealthy ? 'text-green-600 dark:text-green-400' : 'text-[#e85d04]'
              }`}
            >
              ${item.price}
            </span>
          </div>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
          {item.description}
        </p>

        {item.socialProof && (
          <p className="mt-2 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
            {item.socialProof}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <motion.div className="flex flex-wrap gap-1">
            {(item.tags || []).map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${tagStyles[tag] || 'bg-zinc-100 text-zinc-600'}`}
              >
                {tag}
              </span>
            ))}
          </motion.div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              playAdd()
              onAdd(item)
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e85d04] text-white shadow-md shadow-orange-500/30 transition hover:scale-110 active:scale-95"
            aria-label={`Add ${item.name}`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
