import { useState } from 'react'
import { kcal, dayLabel } from '../utils'
import { PencilIcon } from './Icons'

export default function CalorieCard({ day, eaten, goal, onGoalChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const pct = Math.round((eaten / goal) * 100)
  const left = goal - eaten

  function startEditing() {
    setDraft(String(goal))
    setEditing(true)
  }

  function handleSave(e) {
    e.preventDefault()
    const value = Math.round(Number(draft))
    if (value > 0 && value !== goal) onGoalChange(value)
    setEditing(false)
  }

  return (
    <section className="total cal sticker" aria-label="calories eaten">
      <div className="total-head">
        <p className="total-label">eaten {dayLabel(day)}</p>
        <span className="pill">{left >= 0 ? `${kcal(left)} left` : `${kcal(-left)} over`}</span>
      </div>

      <p className="total-amount">
        {eaten.toLocaleString('en-IN')}
        <span className="unit"> kcal</span>
      </p>

      <div>
        <div className="budget-meta">
          {editing ? (
            <form className="budget-form" onSubmit={handleSave}>
              <label htmlFor="cal-goal">daily goal</label>
              <input
                id="cal-goal"
                type="number"
                inputMode="numeric"
                enterKeyHint="done"
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
            <button className="budget-edit" onClick={startEditing} aria-label={`daily goal ${kcal(goal)}, edit`}>
              goal {kcal(goal)}
              <PencilIcon />
            </button>
          )}
          {!editing && <span>{pct}% of goal</span>}
        </div>

        <div
          className="bar"
          role="progressbar"
          aria-label="calorie goal used"
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