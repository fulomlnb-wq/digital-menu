import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import defaultMenu from '../data/menu.json'
import { KEYS, loadJson, saveJson } from '../utils/storage'

const MenuContext = createContext(null)

function mergeMenu(saved) {
  if (!saved) return defaultMenu
  return {
    ...defaultMenu,
    ...saved,
    restaurant: { ...defaultMenu.restaurant, ...saved.restaurant },
    settings: { ...defaultMenu.settings, ...saved.settings },
    categories: saved.categories?.length ? saved.categories : defaultMenu.categories,
    items: saved.items?.length ? saved.items : defaultMenu.items,
    dailySpecial: saved.dailySpecial ?? defaultMenu.dailySpecial,
  }
}

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(() => mergeMenu(loadJson(KEYS.menu)))

  const saveMenu = useCallback((nextMenu) => {
    const merged = mergeMenu(nextMenu)
    setMenu(merged)
    saveJson(KEYS.menu, merged)
  }, [])

  const resetMenu = useCallback(() => {
    setMenu(defaultMenu)
    localStorage.removeItem(KEYS.menu)
  }, [])

  const value = useMemo(
    () => ({
      menu,
      items: menu.items,
      categories: menu.categories,
      settings: menu.settings || {},
      restaurant: menu.restaurant,
      dailySpecial: menu.dailySpecial,
      saveMenu,
      resetMenu,
    }),
    [menu, saveMenu, resetMenu]
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export const useMenu = () => useContext(MenuContext)
