import { MOODS } from '../supabase'
import { shortRupees } from '../utils'
import { MoodIcon } from './Icons'

export default function MoodTiles({ expenses }) {
  const totals = MOODS.map((m) => ({
    ...m,
    total: expenses
      .filter((e) => e.mood === m.id)
      .reduce((sum, e) => sum + Number(e.amount), 0),
  }))

  // show the 4 moods you spent the most on
  const top = [...totals].sort((a, b) => b.total - a.total).slice(0, 4)

  return (
    <section className="moods">
      <h2 className="section-title">this month, by mood</h2>
      <div className="mood-grid">
        {top.map((m) => (
          <div key={m.id} className="mood-tile" style={{ background: m.color }}>
            <MoodIcon mood={m.id} size={28} />
            <span>{m.label}</span>
            <small>{shortRupees(m.total)}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
