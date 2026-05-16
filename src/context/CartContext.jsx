import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + (action.qty || 1) } : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, qty: action.qty || 1 }],
      }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const add = useCallback((item, qty = 1) => {
    dispatch({ type: 'ADD', item, qty })
  }, [])

  const remove = useCallback((id) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const updateQty = useCallback((id, qty) => {
    dispatch({ type: 'UPDATE_QTY', id, qty })
  }, [])

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const total = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [state.items]
  )

  const count = useMemo(
    () => state.items.reduce((sum, i) => sum + i.qty, 0),
    [state.items]
  )

  const value = useMemo(
    () => ({
      items: state.items,
      total,
      count,
      add,
      remove,
      updateQty,
      clear,
    }),
    [state.items, total, count, add, remove, updateQty, clear]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
