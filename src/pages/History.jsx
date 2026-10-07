import { useEffect, useState } from 'react'
import { fetchExpenses } from '../api'
import { monthRange, monthLabel, rupees, sumAmounts, dayLabel } from '../utils'
import ExpenseRow from '../components/ExpenseRow'
import { BackIcon, NextIcon } from '../components/Icons'
import { RowSkeleton } from '../components/Skeleton'
import EmptyDoodle from '../components/EmptyDoodle'

// turns a newest-first list into [{ date, items }] — one group per day
function groupByDay(list) {
  const groups = []
  for (const e of list) {
    const last = groups[groups.length - 1]
    if (last && last.date === e.spent_on) last.items.push(e)
    else groups.push({ date: e.spent_on, items: [e] })
  }
  return groups
}

export default function History({ onEdit, onDelete }) {
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isCurrentMonth = cursor.y === now.getFullYear() && cursor.m === now.getMonth()

  // refetch whenever the month changes
  useEffect(() => {
    let ignore = false // stops an old, slow request from overwriting a newer one
    setLoading(true)
    setError('')
    const { from, to } = monthRange(cursor.y, cursor.m)
    fetchExpenses(from, to)
      .then((data) => !ignore && setList(data))
      .catch(() => !ignore && setError("couldn't load this month. check your internet."))
      .finally(() => !ignore && setLoading(false))
    return () => { ignore = true }
  }, [cursor.y, cursor.m])

  function shiftMonth(delta) {
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  async function handleDelete(id) {
    const ok = await onDelete(id)
    if (ok) setList((prev) => prev.filter((e) => e.id !== id))
  }

  const label = monthLabel(cursor.y, cursor.m)
  const groups = groupByDay(list)

  return (
    <>
      <header className="page-head">
        <h1>history</h1>
      </header>

      <div className="month-switch sticker">
        <button className="round-btn" aria-label="previous month" onClick={() => shiftMonth(-1)}>
          <BackIcon />
        </button>
        <div className="month-switch-text">
          <p className="month-name">{label}</p>
          <p className="month-total">
            {rupees(sumAmounts(list))} across {list.length} spend{list.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          className="round-btn"
          aria-label="next month"
          disabled={isCurrentMonth}
          onClick={() => shiftMonth(1)}
        >
          <NextIcon />
        </button>
      </div>

      {loading && <RowSkeleton count={4} />}
      {!loading && error && <p className="empty">{error}</p>}
      {!loading && !error && list.length === 0 && (
        <EmptyDoodle kind="calendar">no spends logged in {label}.</EmptyDoodle>
      )}

      {!loading && !error && (
        <div className="history-list">
          {groups.map((g) => (
            <section key={g.date} className="day-group">
              <div className="day-head">
                <h2>{dayLabel(g.date)}</h2>
                <span>{rupees(sumAmounts(g.items))}</span>
              </div>
              {g.items.map((e, i) => (
                <ExpenseRow key={e.id} expense={e} onEdit={onEdit} onDelete={handleDelete} showDate={false} style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }} />
              ))}
            </section>
          ))}
        </div>
      )}
    </>
  )
}