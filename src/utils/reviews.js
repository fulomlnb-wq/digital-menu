import { KEYS, loadJson, saveJson } from './storage'

export function getReviews() {
  return loadJson(KEYS.reviews, [])
}

export function submitReview({ rating, comment, orderId }) {
  const review = {
    id: `rev-${Date.now()}`,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: (comment || '').trim(),
    orderId: orderId || null,
    createdAt: new Date().toISOString(),
  }
  const prev = getReviews()
  prev.unshift(review)
  saveJson(KEYS.reviews, prev)
  return review
}
