import { useState } from 'react'
import { rupees, daysLeftInMonth, monthName } from '../utils'
import { PencilIcon } from './Icons'

export default function TotalCard({ total, budget, onBudgetChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const pct = Math.round((total / budget) * 100)
  const over = total > budget
  const left = daysLeftInMonth()

  function startEditing() {
    setDraft(String(budget))
    setEditing(true)
  }

  function handleSave(e) {
    e.preventDefault()
    const value = Math.round(Number(draft))
    if (value > 0 && value !== budget) onBudgetChange(value)
    setEditing(false)
  }

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
          {editing ? (
            <form className="budget-form" onSubmit={handleSave}>
              <label htmlFor="budget">budget ₹</label>
              <input
                id="budget"
                type="number"
                inputMode="numeric"
                min="1"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
              />
              <button type="submit" className="mini-btn">save</button>
              <button type="button" className="mini-btn ghost" onClick={() => setEditing(false)}>
                cancel
              </button>
            </form>
          ) : (
            <button className="budget-edit" onClick={startEditing} aria-label={`budget ${rupees(budget)}, edit`}>
              budget {rupees(budget)}
              <PencilIcon />
            </button>
          )}
          {!editing && (
            <span>{over ? `over by ${rupees(total - budget)}` : `${pct}% used`}</span>
          )}
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
