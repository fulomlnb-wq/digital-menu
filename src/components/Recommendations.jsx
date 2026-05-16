import { memo } from 'react'
import { Sparkles } from 'lucide-react'
import { useSound } from '../hooks/useSound'
import MenuImage from './MenuImage'

function Recommendations({ items, onAdd, onOpen }) {
  const { playAdd } = useSound()

  if (!items?.length) return null

  return (
    <section className="px-4 pb-6">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="text-brand" size={18} />
        <h2 className="text-sm font-semibold text-primary">You might also like…</h2>
      </div>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(item)}
            className="w-36 shrink-0 overflow-hidden rounded-xl border border-default bg-card text-left transition active:scale-[0.97]"
          >
            <MenuImage item={item} className="h-24 w-full object-cover" />
            <div className="p-2">
              <p className="line-clamp-1 text-xs font-medium text-primary">{item.name}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-brand">${item.price}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    playAdd()
                    onAdd(item)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onAdd(item)
                  }}
                  className="rounded-full bg-[#e85d04] px-2 py-0.5 text-[10px] text-white"
                >
                  Add
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export default memo(Recommendations)
