import { useEffect, useState } from 'react'
import { fetchExpenses } from '../api'
import { MOODS } from '../supabase'
import { monthRange, shortMonth, monthName, rupees, shortRupees, sumAmounts } from '../utils'
import { MoodIcon } from '../components/Icons'

const MONTHS_SHOWN = 6
const PLOT_MAX = 85 // tallest bar uses 85% of the chart height, leaving room for its label

export default function Stats({ budget }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const now = new Date()

  // the last 6 months, oldest first
  const months = Array.from({ length: MONTHS_SHOWN }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS_SHOWN - 1) + i, 1)
    const { from, to } = monthRange(d.getFullYear(), d.getMonth())
    return { from, to, label: shortMonth(d.getFullYear(), d.getMonth()) }
  })

  // one request for all 6 months
  useEffect(() => {
    fetchExpenses(months[0].from, months[MONTHS_SHOWN - 1].to)
      .then(setList)
      .catch(() => setError("couldn't load your stats. check your internet."))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <><PageHead /><p className="empty">crunching numbers…</p></>
  if (error) return <><PageHead /><p className="empty">{error}</p></>

  const bars = months.map((m, i) => {
    const items = list.filter((e) => e.spent_on >= m.from && e.spent_on < m.to)
    return { ...m, items, total: sumAmounts(items), current: i === MONTHS_SHOWN - 1 }
  })
  const thisMonth = bars[MONTHS_SHOWN - 1]
  const lastMonth = bars[MONTHS_SHOWN - 2]

  // facts
  const perDay = thisMonth.total / now.getDate()
  const change = lastMonth.total > 0
    ? Math.round(((thisMonth.total - lastMonth.total) / lastMonth.total) * 100)
    : null
  const biggest = thisMonth.items.reduce(
    (max, e) => (!max || Number(e.amount) > Number(max.amount) ? e : max),
    null
  )

  // chart scale: the budget line always fits
  const scale = Math.max(budget, ...bars.map((b) => b.total))
  const heightOf = (n) => (n / scale) * PLOT_MAX

  // mood breakdown for this month
  const moodTotals = MOODS
    .map((m) => ({ ...m, total: sumAmounts(thisMonth.items.filter((e) => e.mood === m.id)) }))
    .filter((m) => m.total > 0)
    .sort((a, b) => b.total - a.total)

  return (
    <>
      <PageHead />

      <div className="facts">
        <div className="fact">
          <p className="fact-label">per day so far</p>
          <p className="fact-value">{rupees(perDay)}</p>
        </div>
        <div className="fact">
          <p className="fact-label">vs last month</p>
          <p className="fact-value">
            {change === null ? 'new!' : `${change > 0 ? '+' : ''}${change}%`}
          </p>
          <p className="fact-sub">
            {change === null ? 'nothing to compare yet' : change > 0 ? 'spending more' : 'spending less'}
          </p>
        </div>
        <div className="fact">
          <p className="fact-label">biggest spend</p>
          <p className="fact-value">{biggest ? rupees(Number(biggest.amount)) : '₹0'}</p>
          <p className="fact-sub">{biggest ? biggest.note || biggest.mood : 'none yet'}</p>
        </div>
      </div>

      <section className="card">
        <h2 className="section-title">last {MONTHS_SHOWN} months</h2>
        <div className="chart">
          <div className="budget-line" style={{ bottom: `${heightOf(budget)}%` }}>
            <span>budget {shortRupees(budget)}</span>
          </div>
          {bars.map((b) => (
            <div key={b.from} className="chart-col">
              <div
                className={`chart-bar${b.current ? ' current' : ''}`}
                style={{ height: `${heightOf(b.total)}%` }}
              >
                <span className="chart-value">{shortRupees(b.total)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-labels">
          {bars.map((b) => (
            <span key={b.from} className={b.current ? 'current' : undefined}>{b.label}</span>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">where {monthName()} went</h2>
        {moodTotals.length === 0 && <p className="empty">add a spend this month to see the split.</p>}
        <div className="mood-split">
          {moodTotals.map((m) => {
            const pct = Math.round((m.total / thisMonth.total) * 100)
            return (
              <div key={m.id} className="split-row">
                <span className="split-chip" style={{ background: m.color }}>
                  <MoodIcon mood={m.id} size={20} />
                </span>
                <div className="split-body">
                  <div className="split-text">
                    <span>{m.label}</span>
                    <span>{rupees(m.total)} <small>{pct}%</small></span>
                  </div>
                  <div className="track">
                    <div className="track-fill" style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

function PageHead() {
  return (
    <header className="page-head">
      <h1>stats</h1>
    </header>
  )
}
