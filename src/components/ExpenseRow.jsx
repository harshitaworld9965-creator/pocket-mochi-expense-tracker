import { MOODS } from '../supabase'
import { rupees, dayLabel } from '../utils'
import { MoodIcon, TrashIcon } from './Icons'

export const moodOf = (id) => MOODS.find((m) => m.id === id) ?? MOODS[MOODS.length - 1]

// one spend — used on Home and History. Tap the row to edit it, the bin to delete it.
export default function ExpenseRow({ expense, onEdit, onDelete, showDate = true, style }) {
  const m = moodOf(expense.mood)
  const name = expense.note || m.label

  return (
    <div className="row pop" style={style}>
      <button className="row-main" onClick={() => onEdit(expense)} aria-label={`edit ${name}`}>
        <span className="row-icon" style={{ background: m.color }}>
          <MoodIcon mood={m.id} size={22} />
        </span>
        <span className="row-text">
          <span className="row-note">{name}</span>
          <span className="row-meta">{showDate ? `${dayLabel(expense.spent_on)}, ${m.label}` : m.label}</span>
        </span>
        <span className="row-amount">{rupees(Number(expense.amount))}</span>
      </button>
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