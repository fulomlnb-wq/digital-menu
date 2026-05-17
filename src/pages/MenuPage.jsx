import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMenu } from '../context/MenuContext'
import { CartProvider, useCart } from '../context/CartContext'
import WelcomeScreen from '../components/WelcomeScreen'
import Header from '../components/Header'
import DailySpecials from '../components/DailySpecials'
import SearchFilter from '../components/SearchFilter'
import CategoryNav from '../components/CategoryNav'
import MenuCard from '../components/MenuCard'
import CartButton from '../components/CartButton'
import CartDrawer from '../components/CartDrawer'
import CartToast from '../components/CartToast'
import Recommendations from '../components/Recommendations'
import { useSwipe } from '../hooks/useSwipe'
import { getRecommendations } from '../utils/recommendations'

const ItemModal = lazy(() => import('../components/ItemModal'))

const TAGS = ['popular', 'spicy', 'vegan', 'healthy']

function MenuContent() {
  const { menu, items, categories, restaurant, dailySpecial } = useMenu()
  const { add, items: cartItems, lastError, clearError } = useCart()

  const [showWelcome, setShowWelcome] = useState(true)
  const [urlTable] = useState(() => new URLSearchParams(window.location.search).get('table'))
  const [category, setCategory] = useState('starters')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')

  const categoryIds = useMemo(() => categories.map((c) => c.id), [categories])

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (lastError) setToast(lastError)
  }, [lastError])

  const goCategory = useCallback((dir) => {
    setCategory((current) => {
      const idx = categoryIds.indexOf(current)
      const next = idx + dir
      if (next >= 0 && next < categoryIds.length) return categoryIds[next]
      return current
    })
  }, [categoryIds])

  useSwipe(() => goCategory(1), () => goCategory(-1))

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = item.category === category
      const matchQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      const matchTag = !activeTag || item.tags?.includes(activeTag)
      return matchCategory && matchQuery && matchTag
    })
  }, [items, category, query, activeTag])

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const score = (i) => (i.highMargin ? 2 : 0) + (i.popular ? 1 : 0)
      return score(b) - score(a)
    })
  }, [filteredItems])

  const recommendations = useMemo(
    () => getRecommendations(items, cartItems),
    [items, cartItems]
  )

  const dailyItem = useMemo(
    () => items.find((i) => i.id === dailySpecial?.itemId),
    [items, dailySpecial]
  )

  const handleAddItem = useCallback(
    (item, qty = 1) => {
      const result = add(item, qty)
      if (!result?.ok) setToast(result.message)
      return result
    },
    [add]
  )

  const handleOpenItem = useCallback((item) => {
    setSelectedItem(item)
    if (item.category) setCategory(item.category)
  }, [])

  return (
    <div className="min-h-screen bg-page pb-28">
      <CartToast message={toast} onDismiss={() => { setToast(''); clearError() }} />

      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen
            restaurant={restaurant}
            tableNumber={urlTable}
            onComplete={() => setShowWelcome(false)}
          />
        )}
      </AnimatePresence>

      <Header restaurant={restaurant} tableNumber={urlTable} />

      <main id="menu-swipe-zone">
        <DailySpecials
          special={dailySpecial}
          onSelect={() => dailyItem && setSelectedItem(dailyItem)}
        />

        <SearchFilter
          query={query}
          onQueryChange={setQuery}
          tags={TAGS}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          allItems={items}
          onSelectItem={handleOpenItem}
        />

        <CategoryNav categories={categories} active={category} onChange={setCategory} />

        <p className="px-4 pb-2 text-[10px] text-muted md:hidden">
          Swipe left/right to change category
        </p>

        <section className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
          {sortedItems.map((item, index) => (
            <MenuCard
              key={item.id}
              item={item}
              index={index}
              onOpen={setSelectedItem}
              onAdd={(i) => handleAddItem(i, 1)}
            />
          ))}
        </section>

        {sortedItems.length === 0 && (
          <p className="py-12 text-center text-sm text-muted">No dishes match your search.</p>
        )}

        <Recommendations
          items={recommendations}
          onAdd={handleAddItem}
          onOpen={setSelectedItem}
        />
      </main>

      <p className="pb-4 text-center text-[10px] text-muted">
        <Link to="/admin" className="underline">
          Manager login
        </Link>
      </p>

      <CartButton onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} urlTableNumber={urlTable} />

      <AnimatePresence>
        {selectedItem && (
          <Suspense fallback={null}>
            <ItemModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onAdd={handleAddItem}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MenuPage() {
  return (
    <CartProvider>
      <MenuContent />
    </CartProvider>
  )
}
