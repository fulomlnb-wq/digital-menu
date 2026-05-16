import { useEffect, useRef } from 'react'

/** Horizontal swipe detection for category navigation on mobile */
export function useSwipe(onSwipeLeft, onSwipeRight, threshold = 50) {
  const touchStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = document.getElementById('menu-swipe-zone')
    if (!el) return

    const onStart = (e) => {
      const t = e.touches?.[0] || e
      touchStart.current = { x: t.clientX, y: t.clientY }
    }

    const onEnd = (e) => {
      const t = e.changedTouches?.[0] || e
      const dx = t.clientX - touchStart.current.x
      const dy = t.clientY - touchStart.current.y
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return
      if (dx < 0) onSwipeLeft?.()
      else onSwipeRight?.()
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchend', onEnd)
    }
  }, [onSwipeLeft, onSwipeRight, threshold])
}
