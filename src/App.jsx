import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import menuData from './data/menu.json'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider, useCart } from './context/CartContext'
import WelcomeScreen from './components/WelcomeScreen'
import Header from './components/Header'
import DailySpecials from './components/DailySpecials'
import SearchFilter from './components/SearchFilter'
import CategoryNav from './components/CategoryNav'
import MenuCard from './components/MenuCard'
import CartButton from './components/CartButton'
import CartDrawer from './components/CartDrawer'
import Recommendations from './components/Recommendations'
import { useSwipe } from './hooks/useSwipe'
import { getRecommendations } from './utils/recommendations'

const ItemModal = lazy(() => import('./components/ItemModal'))

const TAGS = ['popular', 'spicy', 'vegan', 'healthy']
const CATEGORY_IDS = menuData.categories.map((c) => c.id)

function MenuApp() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [tableNumber] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('table')
  })
  const [category, setCategory] = useState('starters')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const { add, items: cartItems } = useCart()

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const goCategory = useCallback((dir) => {
    setCategory((current) => {
      const idx = CATEGORY_IDS.indexOf(current)
      const next = idx + dir
      if (next >= 0 && next < CATEGORY_IDS.length) return CATEGORY_IDS[next]
      return current
    })
  }, [])

  useSwipe(() => goCategory(1), () => goCategory(-1))

  const filteredItems = useMemo(() => {
    return menuData.items.filter((item) => {
      const matchCategory = item.category === category
      const matchQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      const matchTag = !activeTag || item.tags?.includes(activeTag)
      return matchCategory && matchQuery && matchTag
    })
  }, [category, query, activeTag])

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const score = (i) => (i.highMargin ? 2 : 0) + (i.popular ? 1 : 0)
      return score(b) - score(a)
    })
  }, [filteredItems])

  const recommendations = useMemo(
    () => getRecommendations(menuData.items, cartItems),
    [cartItems]
  )

  const dailyItem = useMemo(
    () => menuData.items.find((i) => i.id === menuData.dailySpecial?.itemId),
    []
  )

  const handleOpenItem = useCallback((item) => setSelectedItem(item), [])
  const handleAddItem = useCallback((item) => add(item), [add])
  const handleCloseModal = useCallback(() => setSelectedItem(null), [])
  const handleOpenCart = useCallback(() => setCartOpen(true), [])
  const handleCloseCart = useCallback(() => setCartOpen(false), [])

  return (
    <div className="min-h-screen bg-page pb-28">
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen
            restaurant={menuData.restaurant}
            tableNumber={tableNumber}
            onComplete={() => setShowWelcome(false)}
          />
        )}
      </AnimatePresence>

      <Header restaurant={menuData.restaurant} tableNumber={tableNumber} />

      <main id="menu-swipe-zone">
        <DailySpecials
          special={menuData.dailySpecial}
          onSelect={() => dailyItem && setSelectedItem(dailyItem)}
        />

        <SearchFilter
          query={query}
          onQueryChange={setQuery}
          tags={TAGS}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />

        <CategoryNav categories={menuData.categories} active={category} onChange={setCategory} />

        <p className="px-4 pb-2 text-[10px] text-muted md:hidden">
          Swipe left/right to change category
        </p>

        <section className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
          {sortedItems.map((item, index) => (
            <MenuCard
              key={item.id}
              item={item}
              index={index}
              onOpen={handleOpenItem}
              onAdd={handleAddItem}
            />
          ))}
        </section>

        {sortedItems.length === 0 && (
          <p className="py-12 text-center text-sm text-muted">No dishes match your search.</p>
        )}

        <Recommendations
          items={recommendations}
          onAdd={handleAddItem}
          onOpen={handleOpenItem}
        />
      </main>

      <CartButton onClick={handleOpenCart} />
      <CartDrawer
        open={cartOpen}
        onClose={handleCloseCart}
        tableNumber={tableNumber}
        restaurant={menuData.restaurant}
      />

      <AnimatePresence>
        {selectedItem && (
          <Suspense fallback={null}>
            <ItemModal item={selectedItem} onClose={handleCloseModal} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <MenuApp />
      </CartProvider>
    </ThemeProvider>
  )
}
