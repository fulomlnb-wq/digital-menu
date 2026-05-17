import { memo, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

function CartToast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div
      className="fixed left-4 right-4 top-20 z-[60] mx-auto flex max-w-lg items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-lg dark:bg-amber-950/90 dark:text-amber-100"
      role="alert"
    >
      <AlertCircle size={18} className="shrink-0" />
      <p className="flex-1">{message}</p>
      <button type="button" onClick={onDismiss} className="text-xs font-medium underline">
        Dismiss
      </button>
    </div>
  )
}

export default memo(CartToast)
