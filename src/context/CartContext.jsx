import { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react'
import { getStockLimit, getStockMessage } from '../utils/stock'

const CartContext = createContext(null)

function clampQty(item, qty, cartItems) {
  const limit = getStockLimit(item)
  if (limit == null) return qty
  const inCart = cartItems.find((i) => i.id === item.id)?.qty || 0
  const maxAdd = limit - inCart
  return Math.min(qty, Math.max(0, maxAdd))
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { item, qty } = action
      const addQty = clampQty(item, qty || 1, state.items)
      if (addQty <= 0) {
        return { ...state, lastError: getStockMessage(item, getStockLimit(item)) }
      }
      const existing = state.items.find((i) => i.id === item.id)
      const limit = getStockLimit(item)
      let newQty = existing ? existing.qty + addQty : addQty
      if (limit != null) newQty = Math.min(newQty, limit)

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: newQty } : i
          ),
          lastError: null,
        }
      }
      return {
        items: [...state.items, { ...item, qty: newQty }],
        lastError: null,
      }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id), lastError: null }
    case 'UPDATE_QTY': {
      const line = state.items.find((i) => i.id === action.id)
      if (!line) return state
      if (action.qty <= 0) {
        return {
          items: state.items.filter((i) => i.id !== action.id),
          lastError: null,
        }
      }
      const limit = getStockLimit(line)
      if (limit != null && action.qty > limit) {
        return {
          items: state.items,
          lastError: getStockMessage(line, limit),
        }
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
        lastError: null,
      }
    }
    case 'CLEAR':
      return { items: [], lastError: null }
    case 'CLEAR_ERROR':
      return { ...state, lastError: null }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], lastError: null })

  const add = useCallback((item, qty = 1) => {
    const limit = getStockLimit(item)
    const inCart = state.items.find((i) => i.id === item.id)?.qty || 0
    if (limit != null && inCart + qty > limit) {
      return { ok: false, message: getStockMessage(item, limit) }
    }
    dispatch({ type: 'ADD', item, qty })
    return { ok: true }
  }, [state.items])

  const remove = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const updateQty = useCallback((id, qty) => {
    dispatch({ type: 'UPDATE_QTY', id, qty })
    const line = state.items.find((i) => i.id === id)
    if (line && getStockLimit(line) != null && qty > getStockLimit(line)) {
      return { ok: false, message: getStockMessage(line) }
    }
    return { ok: true }
  }, [state.items])
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), [])

  const total = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [state.items]
  )
  const count = useMemo(
    () => state.items.reduce((sum, i) => sum + i.qty, 0),
    [state.items]
  )

  const getMaxQty = useCallback(
    (itemId) => {
      const line = state.items.find((i) => i.id === itemId)
      const item = line || { id: itemId }
      const limit = getStockLimit(item)
      if (limit == null) return Infinity
      return limit
    },
    [state.items]
  )

  const value = useMemo(
    () => ({
      items: state.items,
      total,
      count,
      lastError: state.lastError,
      add,
      remove,
      updateQty,
      clear,
      clearError,
      getMaxQty,
      getStockLimit,
    }),
    [state.items, state.lastError, total, count, add, remove, updateQty, clear, clearError, getMaxQty]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
