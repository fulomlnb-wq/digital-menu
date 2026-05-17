import { Search, X } from 'lucide-react'
import { memo, useMemo, useRef, useState } from 'react'
import { useSound } from '../hooks/useSound'

function SearchFilter({
  query,
  onQueryChange,
  tags,
  activeTag,
  onTagChange,
  allItems = [],
  onSelectItem,
}) {
  const { playClick } = useSound()
  const [focused, setFocused] = useState(false)
  const blurTimer = useRef(null)

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 1) return []
    return allItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [query, allItems])

  const showSuggestions = focused && suggestions.length > 0

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setFocused(false), 150)
  }

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current)
    setFocused(true)
  }

  return (
    <div className="px-4 pb-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted" size={18} />
        <input
          type="search"
          placeholder="Search dishes..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
          className="w-full rounded-xl border border-default bg-input py-2.5 pl-10 pr-10 text-sm text-primary placeholder:text-muted outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-[#e85d04]/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              playClick()
              onQueryChange('')
            }}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {showSuggestions && (
          <ul
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-default bg-card py-1 shadow-xl"
            role="listbox"
          >
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-elevated"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    playClick()
                    onQueryChange(item.name)
                    onSelectItem?.(item)
                    setFocused(false)
                  }}
                >
                  <span className="text-sm font-medium text-primary">{item.name}</span>
                  <span className="text-xs font-semibold text-brand">${item.price}</span>
                </button>
              </li>
            ))}
          </ul>
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
              activeTag === tag ? 'bg-[#e85d04] text-white' : 'bg-elevated text-muted'
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
