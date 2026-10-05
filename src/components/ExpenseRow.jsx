import { MOODS } from '../supabase'
import { rupees, dayLabel } from '../utils'
import { MoodIcon, TrashIcon } from './Icons'

export const moodOf = (id) => MOODS.find((m) => m.id === id) ?? MOODS[MOODS.length - 1]

// one spend — used on Home and History
export default function ExpenseRow({ expense, onDelete, showDate = true }) {
  const m = moodOf(expense.mood)
  const name = expense.note || m.label

  return (
    <div className="row">
      <div className="row-icon" style={{ background: m.color }}>
        <MoodIcon mood={m.id} size={22} />
      </div>
      <div className="row-text">
        <p className="row-note">{name}</p>
        <p className="row-meta">{showDate ? `${dayLabel(expense.spent_on)}, ${m.label}` : m.label}</p>
      </div>
      <p className="row-amount">{rupees(Number(expense.amount))}</p>
      <button
        className="icon-btn"
        aria-label={`delete ${name}`}
        onClick={() => {
          if (window.confirm(`delete "${name}"?`)) onDelete(expense.id)
        }}
      >
        <TrashIcon />
      </button>
    </div>
  )
}
