import { Search, X } from 'lucide-react'
import { useSound } from '../hooks/useSound'

export default function SearchFilter({ query, onQueryChange, tags, activeTag, onTagChange }) {
  const { playClick } = useSound()

  return (
    <div className="px-4 pb-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="search"
          placeholder="Search dishes..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-[#e85d04]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              playClick()
              onQueryChange('')
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
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
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
