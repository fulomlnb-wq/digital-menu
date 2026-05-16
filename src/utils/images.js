/** Local-first image paths for reliable Netlify deployment */
export const FALLBACK_IMAGE = '/images/fallback.svg'

const REMOTE_BY_ID = {
  s1: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80&auto=format&fit=crop',
  s2: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80&auto=format&fit=crop',
  s3: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80&auto=format&fit=crop',
  m1: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80&auto=format&fit=crop',
  m2: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d11a?w=600&q=80&auto=format&fit=crop',
  m3: 'https://images.unsplash.com/photo-1550547660-b9457092a2d2?w=600&q=80&auto=format&fit=crop',
  m4: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop',
  d1: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80&auto=format&fit=crop',
  d2: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80&auto=format&fit=crop',
  d3: 'https://images.unsplash.com/photo-1513558161293-04173fbea0f0?w=600&q=80&auto=format&fit=crop',
  de1: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80&auto=format&fit=crop',
  de2: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80&auto=format&fit=crop',
}

/** Prefer local public assets for Netlify; fallback chain handled in MenuImage */
export function resolveImageSrc(itemOrSrc, itemId) {
  const src = typeof itemOrSrc === 'string' ? itemOrSrc : itemOrSrc?.image
  const id = itemId || (typeof itemOrSrc === 'object' ? itemOrSrc?.id : null)
  if (src?.startsWith('/')) return src
  if (id) return `/images/${id}.jpg`
  if (src?.startsWith('http')) return src
  return FALLBACK_IMAGE
}

export function getRemoteFallback(id) {
  return REMOTE_BY_ID[id] || `https://picsum.photos/seed/menu-${id}/600/450`
}
