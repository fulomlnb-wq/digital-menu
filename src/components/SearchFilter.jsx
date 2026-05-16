import { Search, X } from 'lucide-react'
import { memo } from 'react'
import { useSound } from '../hooks/useSound'

function SearchFilter({ query, onQueryChange, tags, activeTag, onTagChange }) {
  const { playClick } = useSound()

  return (
    <div className="px-4 pb-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          type="search"
          placeholder="Search dishes..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-xl border border-default bg-input py-2.5 pl-10 pr-10 text-sm text-primary placeholder:text-muted outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-[#e85d04]/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              playClick()
              onQueryChange('')
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              playClick()
              onTagChange(activeTag === tag ? null : tag)
            }}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
              activeTag === tag
                ? 'bg-[#e85d04] text-white'
                : 'bg-elevated text-muted'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

export default memo(SearchFilter)
