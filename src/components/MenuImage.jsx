import { memo, useState } from 'react'
import { FALLBACK_IMAGE, getRemoteFallback, resolveImageSrc } from '../utils/images'

function MenuImage({ item, alt = '', className = '', id }) {
  const itemId = id || item?.id
  const primary = resolveImageSrc(item, itemId)
  const [src, setSrc] = useState(primary)
  const [step, setStep] = useState(0)

  const handleError = () => {
    if (step === 0 && itemId) {
      setStep(1)
      setSrc(getRemoteFallback(itemId))
      return
    }
    if (step < 2) {
      setStep(2)
      setSrc(FALLBACK_IMAGE)
    }
  }

  return (
    <img
      src={src}
      alt={alt || item?.name || 'Menu item'}
      className={className}
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  )
}

export default memo(MenuImage)
