import { memo } from 'react'
import { Sparkles } from 'lucide-react'

function DailySpecials({ special, onSelect }) {
  if (!special) return null

  return (
    <button
      type="button"
      onClick={onSelect}
      className="mx-4 mb-4 w-[calc(100%-2rem)] overflow-hidden rounded-2xl bg-gradient-to-r from-[#e85d04] to-[#dc2f02] p-4 text-left text-white shadow-lg shadow-orange-500/25 transition active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 shrink-0" size={20} />
        <div>
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
        </div>
      </div>
    </button>
  )
}

export default memo(DailySpecials)
