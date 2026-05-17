import { memo } from 'react'
import { Sparkles } from 'lucide-react'
import { useSound } from '../hooks/useSound'
import MenuImage from './MenuImage'

function Recommendations({ items, onAdd, onOpen }) {
  const { playAdd } = useSound()

  if (!items?.length) return null

  return (
    <section className="border-t border-default px-4 pb-8 pt-6">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="text-brand" size={18} aria-hidden />
        <h2 className="text-base font-semibold text-primary">You might also like…</h2>
      </div>
      <div className="hide-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {items.map((item) => (
          <article
            key={item.id}
            className="w-36 shrink-0 overflow-hidden rounded-xl border border-default bg-card shadow-sm"
          >
            <button type="button" onClick={() => onOpen(item)} className="block w-full text-left">
              <MenuImage item={item} className="h-24 w-full object-cover" />
              <div className="p-2.5">
                <p className="line-clamp-2 text-xs font-semibold leading-snug text-primary">
                  {item.name}
                </p>
                <p className="mt-1 text-sm font-bold text-brand">${item.price}</p>
              </div>
            </button>
            <div className="border-t border-default px-2 pb-2">
              <button
                type="button"
                onClick={() => {
                  playAdd()
                  onAdd(item, 1)
                }}
                className="mt-2 w-full rounded-full bg-[#e85d04] py-1.5 text-[11px] font-semibold text-white"
              >
                Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default memo(Recommendations)
