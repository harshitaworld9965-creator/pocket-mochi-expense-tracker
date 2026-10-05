import { MOODS } from '../supabase'
import { rupees, dayLabel } from '../utils'
import { MoodIcon, TrashIcon } from './Icons'

const moodOf = (id) => MOODS.find((m) => m.id === id) ?? MOODS[MOODS.length - 1]

export default function RecentList({ expenses, loading, onDelete }) {
  return (
    <section className="recent">
      <h2 className="section-title">recent</h2>

      {loading && <p className="empty">fetching your spends…</p>}

      {!loading && expenses.length === 0 && (
        <p className="empty">nothing logged this month yet. add your first spend and it shows up here.</p>
      )}

      {!loading &&
        expenses.map((e) => {
          const m = moodOf(e.mood)
          const name = e.note || m.label
          return (
            <div key={e.id} className="row">
              <div className="row-icon" style={{ background: m.color }}>
                <MoodIcon mood={m.id} size={22} />
              </div>
              <div className="row-text">
                <p className="row-note">{name}</p>
                <p className="row-meta">
                  {dayLabel(e.spent_on)}, {m.label}
                </p>
              </div>
              <p className="row-amount">{rupees(Number(e.amount))}</p>
              <button
                className="icon-btn"
                aria-label={`delete ${name}`}
                onClick={() => {
                  if (window.confirm(`delete "${name}"?`)) onDelete(e.id)
                }}
              >
                <TrashIcon />
              </button>
            </div>
          )
        })}
    </section>
  )
}
