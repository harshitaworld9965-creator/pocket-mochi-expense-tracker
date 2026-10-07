import { useEffect, useState } from 'react'
import { fetchMeals, insertMeal, removeMeal, loadSetting, saveSetting } from '../api'
import { MEALS, DEFAULT_CALORIES } from '../supabase'
import { todayISO, addDays, weekStartISO, dayLabel, kcal, sumCalories } from '../utils'
import CalorieCard from '../components/CalorieCard'
import WeekStrip from '../components/WeekStrip'
import AddMeal from '../components/AddMeal'
import { MealIcon, BackIcon, NextIcon, TrashIcon } from '../components/Icons'
import { RowSkeleton } from '../components/Skeleton'
import EmptyDoodle from '../components/EmptyDoodle'

export default function Food({ showAdd, onCloseAdd }) {
  const [day, setDay] = useState(todayISO())
  const [meals, setMeals] = useState([]) // the whole week that `day` is in
  const [goal, setGoal] = useState(DEFAULT_CALORIES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const week = weekStartISO(day)
  const isToday = day === todayISO()

  // the goal only needs loading once
  useEffect(() => {
    loadSetting('daily_calories', DEFAULT_CALORIES).then(setGoal).catch(() => {})
  }, [])

  // refetch only when you move into a different week — moving between days in the same week is instant
  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    fetchMeals(week, addDays(week, 7))
      .then((data) => !ignore && setMeals(data))
      .catch(() => !ignore && setError("couldn't load your meals. check your internet."))
      .finally(() => !ignore && setLoading(false))
    return () => { ignore = true }
  }, [week])

  const dayMeals = meals.filter((m) => m.eaten_on === day)
  const eaten = sumCalories(dayMeals)

  async function addMeal(meal) {
    const saved = await insertMeal(meal) // AddMeal catches errors itself
    if (weekStartISO(saved.eaten_on) === week) setMeals((prev) => [...prev, saved])
    onCloseAdd()
  }

  async function deleteMeal(id) {
    const before = meals
    setMeals((prev) => prev.filter((m) => m.id !== id))
    try {
      await removeMeal(id)
    } catch {
      setMeals(before)
      setError("couldn't delete that. try again.")
    }
  }

  async function changeGoal(value) {
    const before = goal
    setGoal(value)
    try {
      await saveSetting('daily_calories', value)
    } catch {
      setGoal(before)
      setError("couldn't save your new goal. try again.")
    }
  }

  return (
    <>
      <header className="page-head">
        <h1>food</h1>
      </header>

      {error && (
        <div className="error" role="alert">
          <p>{error}</p>
          <button className="mini-btn ghost" onClick={() => setError('')}>ok</button>
        </div>
      )}

      <div className="bottom-row">
        <div className="food-main">
          <div className="month-switch day-switch sticker">
            <button className="round-btn" aria-label="previous day" onClick={() => setDay(addDays(day, -1))}>
              <BackIcon />
            </button>
            <div className="month-switch-text">
              <p className="month-name">{dayLabel(day)}</p>
              <p className="month-total">
                {dayMeals.length} thing{dayMeals.length === 1 ? '' : 's'} logged
              </p>
            </div>
            <button
              className="round-btn"
              aria-label="next day"
              disabled={isToday}
              onClick={() => setDay(addDays(day, 1))}
            >
              <NextIcon />
            </button>
          </div>

          <CalorieCard day={day} eaten={eaten} goal={goal} onGoalChange={changeGoal} />

          <WeekStrip weekStart={week} meals={meals} selected={day} goal={goal} onSelect={setDay} />

          {loading && <RowSkeleton />}
          {!loading && dayMeals.length === 0 && (
            <EmptyDoodle kind="bowl">nothing logged for {dayLabel(day)} yet. add what you ate and it shows up here.</EmptyDoodle>
          )}

          {!loading &&
            MEALS.map((m) => {
              const items = dayMeals.filter((x) => x.meal === m.id)
              if (items.length === 0) return null
              return (
                <section key={m.id} className="day-group">
                  <div className="day-head">
                    <h2>{m.label}</h2>
                    <span>{kcal(sumCalories(items))}</span>
                  </div>
                  {items.map((item, i) => (
                    <div key={item.id} className="row pop" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                      <div className="row-icon" style={{ background: m.color }}>
                        <MealIcon meal={m.id} size={22} />
                      </div>
                      <div className="row-text">
                        <p className="row-note">{item.name}</p>
                      </div>
                      <p className="row-amount">
                        {item.calories.toLocaleString('en-IN')} <small>kcal</small>
                      </p>
                      <button
                        className="icon-btn"
                        aria-label={`delete ${item.name}`}
                        onClick={() => {
                          if (window.confirm(`delete "${item.name}"?`)) deleteMeal(item.id)
                        }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </section>
              )
            })}
        </div>

        <AddMeal open={showAdd} onClose={onCloseAdd} onSave={addMeal} day={day} />
      </div>
    </>
  )
}