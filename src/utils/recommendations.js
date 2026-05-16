/** Rule-based "AI" recommendations from cart + high-margin boost */
export function getRecommendations(menuItems, cartItems, limit = 3) {
  const cartIds = new Set(cartItems.map((i) => i.id))
  const cartCategories = new Set(cartItems.map((i) => i.category))
  const cartTags = new Set(cartItems.flatMap((i) => i.tags || []))

  const scored = menuItems
    .filter((item) => !cartIds.has(item.id))
    .map((item) => {
      let score = 0
      if (item.highMargin) score += 3
      if (item.popular) score += 2
      if (cartCategories.has(item.category)) score += 2
      if ((item.tags || []).some((t) => cartTags.has(t))) score += 2
      if (item.scarcity) score += 1
      return { item, score }
    })
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((s) => s.item)
}
