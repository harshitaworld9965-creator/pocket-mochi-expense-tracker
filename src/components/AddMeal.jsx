import { useEffect, useRef, useState } from 'react'
import { confetti } from '../confetti'
import { MEALS } from '../supabase'
import { dayLabel, guessMeal } from '../utils'
import { MealIcon, BackIcon } from './Icons'

export default function AddMeal({ open, onClose, onSave, day, editing, onUpdate, onCancelEdit }) {
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [meal, setMeal] = useState(guessMeal())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const headSaveRef = useRef(null)
  const saveRef = useRef(null)

  useEffect(() => {
    if (!editing) return
    setName(editing.name)
    setCalories(String(editing.calories))
    setMeal(editing.meal)
    setError('')
  }, [editing])

  function reset() {
    setName('')
    setCalories('') // the meal stays picked, so logging several items for lunch is quick
    setError('')
  }

  function cancelEdit() {
    reset()
    onCancelEdit()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const value = Math.round(Number(calories))
    if (!name.trim()) {
      setError('add what you ate')
      return
    }
    if (!(value > 0)) {
      setError('enter calories above 0')
      return
    }

    setSaving(true)
    setError('')
    try {
      const visibleButton = headSaveRef.current?.offsetParent ? headSaveRef.current : saveRef.current
      if (editing) await onUpdate(editing.id, { name: name.trim(), calories: value, meal })
      else await onSave({ name: name.trim(), calories: value, meal, eaten_on: day })
      confetti(visibleButton)
      reset()
    } catch {
      setError("couldn't save. check your internet and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={`add${open ? ' open' : ''}`} onSubmit={handleSubmit}>
      <div className="add-head">
        <button
          type="button"
          className="back"
          aria-label="back to food"
          onClick={() => {
            if (editing) cancelEdit()
            onClose()
          }}
        >
          <BackIcon />
        </button>
        <h2>{editing ? 'edit food' : 'add food'}</h2>
        {editing && (
          <button type="button" className="link-btn cancel-edit" onClick={cancelEdit}>
            cancel
          </button>
        )}
        <button type="submit" className="head-save" disabled={saving} ref={headSaveRef}>
          {saving ? 'saving…' : editing ? 'update' : 'save'}
        </button>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <p className="logging-for">{editing ? `logged on ${dayLabel(editing.eaten_on)}` : `logging for ${dayLabel(day)}`}</p>

      <div className="field">
        <label htmlFor="meal-name">what did you eat?</label>
        <input
          id="meal-name"
          className="text-input"
          type="text"
          enterKeyHint="next"
          placeholder="poha, dal chawal, chai…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="amount-box sticker">
        <label htmlFor="meal-cal">how many calories?</label>
        <div className="amount-input">
          <input
            id="meal-cal"
            type="number"
            inputMode="numeric"
            enterKeyHint="done"
            min="0"
            placeholder="0"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <span className="suffix">kcal</span>
        </div>
      </div>

      <fieldset className="field">
        <legend>which meal?</legend>
        <div className="mood-picker">
          {MEALS.map((m) => (
            <button
              key={m.id}
              type="button"
              className="mood-btn"
              aria-pressed={meal === m.id}
              style={{ '--c': m.color }}
              onClick={() => setMeal(m.id)}
            >
              <MealIcon meal={m.id} size={26} />
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="save-bar">
        <button type="submit" className="save" disabled={saving} ref={saveRef}>
          {saving ? 'saving…' : editing ? 'update it' : 'save it'}
        </button>
      </div>
    </form>
  )
}