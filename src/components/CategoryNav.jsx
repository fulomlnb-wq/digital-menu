import { memo } from 'react'
import { useSound } from '../hooks/useSound'

function CategoryNav({ categories, active, onChange }) {
  const { playClick } = useSound()

  return (
    <nav className="hide-scrollbar flex gap-2 overflow-x-auto px-4 pb-4">
      {categories.map((cat) => {
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              playClick()
              onChange(cat.id)
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-[#e85d04] text-white'
                : 'bg-elevated text-muted'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </button>
        )
      })}
    </nav>
  )
}

export default memo(CategoryNav)
