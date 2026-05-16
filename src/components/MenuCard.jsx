import { memo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Plus } from 'lucide-react'
import { useSound } from '../hooks/useSound'
import MenuImage from './MenuImage'

const tagStyles = {
  spicy: 'bg-red-500/15 text-red-600 dark:text-red-400',
  vegan: 'bg-green-500/15 text-green-700 dark:text-green-400',
  popular: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  healthy: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
}

function MenuCard({ item, index, onOpen, onAdd }) {
  const { playAdd } = useSound()
  const isHealthy = item.tags?.includes('healthy') || item.tags?.includes('vegan')
  const animDelay = Math.min(index * 0.03, 0.15)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.25 }}
      className={`group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md ${
        item.popular
          ? 'border-orange-300/60 ring-1 ring-orange-400/30 dark:border-orange-500/40'
          : 'border-default'
      } ${isHealthy ? 'ring-1 ring-green-500/20' : ''}`}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(item)}
    >
      {item.popular && (
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e85d04] to-[#dc2f02] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
          <Flame size={10} />
          Most Popular
        </div>
      )}

      <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
        <MenuImage
          item={item}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {item.scarcity && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-sm">
            {item.scarcity}
          </span>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-primary">{item.name}</h3>
          <div className="text-right">
            {item.anchorPrice > item.price && (
              <span className="block text-[10px] text-muted line-through">
                ${item.anchorPrice}
              </span>
            )}
            <span
              className={`text-sm font-bold ${
                isHealthy ? 'text-green-600 dark:text-green-400' : 'text-brand'
              }`}
            >
              ${item.price}
            </span>
          </div>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-muted">{item.description}</p>

        {item.socialProof && (
          <p className="mt-2 text-[10px] font-medium text-muted">{item.socialProof}</p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {(item.tags || []).map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${tagStyles[tag] || 'bg-elevated text-muted'}`}
              >
                {tag}
              </span>
            ))}
          </div>
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

export default memo(MenuCard)
