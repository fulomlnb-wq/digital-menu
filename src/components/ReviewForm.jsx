import { memo, useState } from 'react'
import { Star } from 'lucide-react'
import { submitReview } from '../utils/reviews'

function ReviewForm({ orderId, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating < 1) return
    submitReview({ rating, comment, orderId })
    setDone(true)
    onSubmitted?.()
  }

  if (done) {
    return (
      <p className="mt-4 text-center text-sm text-muted">Thank you for your feedback!</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t border-default pt-4">
      <p className="mb-2 text-sm font-medium text-primary">Rate your experience</p>
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-1"
            aria-label={`${n} stars`}
          >
            <Star
              size={28}
              className={
                n <= (hover || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-zinc-300 dark:text-zinc-600'
              }
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment..."
        rows={2}
        className="mt-3 w-full rounded-xl border border-default bg-input px-3 py-2 text-sm text-primary placeholder:text-muted outline-none focus:border-[#e85d04]"
      />
      <button
        type="submit"
        disabled={rating < 1}
        className="mt-3 w-full rounded-full bg-elevated py-2.5 text-sm font-medium text-primary disabled:opacity-40"
      >
        Submit review
      </button>
    </form>
  )
}

export default memo(ReviewForm)
