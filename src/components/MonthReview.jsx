import { MOODS } from '../supabase'
import { monthLabel, rupees, sumAmounts, dayLabel, daysInMonth } from '../utils'
import Mochi, { mochiMood } from './Mochi'

// a little "september in review" card — shown on home for the first days of a month, and always on stats
export default function MonthReview({ expenses, year, month, budget, onDismiss }) {
  if (expenses.length === 0) return null

  const total = sumAmounts(expenses)
  const diff = budget - total

  const topMood = MOODS
    .map((m) => ({ ...m, total: sumAmounts(expenses.filter((e) => e.mood === m.id)) }))
    .sort((a, b) => b.total - a.total)[0]

  const biggest = expenses.reduce((max, e) => (Number(e.amount) > Number(max.amount) ? e : max))

  const byDay = {}
  for (const e of expenses) byDay[e.spent_on] = (byDay[e.spent_on] || 0) + Number(e.amount)
  const [busiestDay, busiestTotal] = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]

  return (
    <section className="review sticker" aria-label={`${monthLabel(year, month)} in review`}>
      <div className="review-head">
        <div>
          <p className="total-label">{monthLabel(year, month)} in review</p>
          <p className="review-total">{rupees(total)}</p>
          <p className="review-sub">
            {diff >= 0 ? `${rupees(diff)} under budget` : `${rupees(-diff)} over budget`}, across{' '}
            {expenses.length} spend{expenses.length === 1 ? '' : 's'}
          </p>
        </div>
        <span className="avatar">
          <Mochi mood={mochiMood((total / budget) * 100)} size={30} />
        </span>
      </div>

      <div className="review-grid">
        <div className="review-fact">
          <span>top mood</span>
          <strong>{topMood.label}</strong>
          <small>{rupees(topMood.total)}</small>
        </div>
        <div className="review-fact">
          <span>biggest spend</span>
          <strong>{biggest.note || biggest.mood}</strong>
          <small>{rupees(Number(biggest.amount))}</small>
        </div>
        <div className="review-fact">
          <span>busiest day</span>
          <strong>{dayLabel(busiestDay)}</strong>
          <small>{rupees(busiestTotal)}</small>
        </div>
        <div className="review-fact">
          <span>per day</span>
          <strong>{rupees(total / daysInMonth(year, month))}</strong>
          <small>on average</small>
        </div>
      </div>

      {onDismiss && (
        <button className="mini-btn review-dismiss" onClick={onDismiss}>
          got it
        </button>
      )}
    </section>
  )
}