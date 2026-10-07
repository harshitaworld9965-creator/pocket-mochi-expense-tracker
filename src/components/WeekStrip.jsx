import { addDays, todayISO, weekdayShort, dayLabel, sumCalories } from '../utils'

// 7 little bars, monday to sunday — tap one to see that day
export default function WeekStrip({ weekStart, meals, selected, goal, onSelect }) {
  const today = todayISO()

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date,
      total: sumCalories(meals.filter((m) => m.eaten_on === date)),
      future: date > today,
    }
  })

  const scale = Math.max(goal, ...days.map((d) => d.total))
  const goalPct = (goal / scale) * 100

  return (
    <section className="card">
      <h2 className="section-title">this week</h2>
      <div className="week-bars">
        {days.map((d) => (
          <button
            key={d.date}
            className="week-day"
            aria-pressed={d.date === selected}
            aria-label={`${dayLabel(d.date)}, ${d.total} kcal`}
            disabled={d.future}
            onClick={() => onSelect(d.date)}
          >
            <span className="week-track">
              <span className="week-goal" style={{ bottom: `${goalPct}%` }} />
              <span
                className={`week-fill${d.total > goal ? ' over' : ''}`}
                style={{ height: `${(d.total / scale) * 100}%` }}
              />
            </span>
            <span className="week-name">{weekdayShort(d.date)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}