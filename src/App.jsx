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
const ItemModal = lazy(() => import('./components/ItemModal'))
import CartButton from './components/CartButton'
import CartDrawer from './components/CartDrawer'
import Recommendations from './components/Recommendations'
import { useSwipe } from './hooks/useSwipe'
import { getRecommendations } from './utils/recommendations'

const TAGS = ['popular', 'spicy', 'vegan', 'healthy']
const CATEGORY_IDS = menuData.categories.map((c) => c.id)

function MenuApp() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [tableNumber, setTableNumber] = useState(null)
  const [category, setCategory] = useState('starters')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const { add, items: cartItems } = useCart()

  // QR / table param: ?table=5
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const table = params.get('table')
    if (table) setTableNumber(table)

    const timer = setTimeout(() => setShowWelcome(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const goCategory = useCallback((dir) => {
    const idx = CATEGORY_IDS.indexOf(category)
    const next = idx + dir
    if (next >= 0 && next < CATEGORY_IDS.length) {
      setCategory(CATEGORY_IDS[next])
    }
  }, [category])

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

  // Sort: high-margin + popular first (psychological default focus)
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

  const dailyItem = menuData.items.find((i) => i.id === menuData.dailySpecial?.itemId)

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-28 transition-colors dark:bg-[#0a0a0b]">
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

        <CategoryNav
          categories={menuData.categories}
          active={category}
          onChange={setCategory}
        />

        <p className="px-4 pb-2 text-[10px] text-zinc-400 md:hidden">
          Swipe left/right to change category
        </p>

        <section className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {sortedItems.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                onOpen={setSelectedItem}
                onAdd={add}
              />
            ))}
          </AnimatePresence>
        </section>

        {sortedItems.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-500">No dishes match your search.</p>
        )}

        <Recommendations
          items={recommendations}
          onAdd={add}
          onOpen={setSelectedItem}
        />
      </main>

      <CartButton onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <AnimatePresence>
        {selectedItem && (
          <Suspense fallback={null}>
            <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
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
