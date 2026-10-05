import { MONTHLY_BUDGET } from '../supabase'
import { rupees, daysLeftInMonth, monthName } from '../utils'

export default function TotalCard({ total }) {
  const pct = Math.round((total / MONTHLY_BUDGET) * 100)
  const over = total > MONTHLY_BUDGET
  const left = daysLeftInMonth()

  return (
    <section className="total sticker" aria-label="this month's total">
      <div className="total-head">
        <p className="total-label">spent in {monthName()}</p>
        <span className="pill">
          {left === 0 ? 'last day!' : `${left} day${left === 1 ? '' : 's'} left`}
        </span>
      </div>

      <p className="total-amount">{rupees(total)}</p>

      <div>
        <div className="budget-meta">
          <span>budget {rupees(MONTHLY_BUDGET)}</span>
          <span>{over ? `over by ${rupees(total - MONTHLY_BUDGET)}` : `${pct}% used`}</span>
        </div>
        <div
          className="bar"
          role="progressbar"
          aria-label="budget used"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(pct, 100)}
        >
          <div className="bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      </div>
    </section>
  )
}
