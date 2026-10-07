import { useState } from 'react'
import { MOODS } from '../supabase'
import { todayISO } from '../utils'
import { MoodIcon, BackIcon } from './Icons'

export default function AddExpense({ open, onClose, onSave }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [mood, setMood] = useState('food')
  const [date, setDate] = useState(todayISO())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) {
      setError('enter an amount above ₹0')
      return
    }

    setSaving(true)
    setError('')
    try {
      await onSave({ amount: value, note: note.trim(), mood, spent_on: date })
      setAmount('')
      setNote('')
      setMood('food')
      setDate(todayISO())
    } catch {
      setError("couldn't save. check your internet and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={`add${open ? ' open' : ''}`} onSubmit={handleSubmit}>
      <div className="add-head">
        <button type="button" className="back" aria-label="back to home" onClick={onClose}>
          <BackIcon />
        </button>
        <h2>new expense</h2>
        <button type="submit" className="head-save" disabled={saving}>
          {saving ? 'saving…' : 'save'}
        </button>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="amount-box sticker">
        <label htmlFor="amount">how much?</label>
        <div className="amount-input">
          <span>₹</span>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            enterKeyHint="next"
            min="0"
            step="any"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="note">what was it?</label>
        <input
          id="note"
          className="text-input"
          type="text"
          placeholder="chai, auto, snacks…"
          enterKeyHint="done"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <fieldset className="field">
        <legend>pick a mood</legend>
        <div className="mood-picker">
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              className="mood-btn"
              aria-pressed={mood === m.id}
              style={{ '--c': m.color }}
              onClick={() => setMood(m.id)}
            >
              <MoodIcon mood={m.id} size={26} />
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="date">when?</label>
        <input
          id="date"
          className="text-input"
          type="date"
          max={todayISO()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* sticky bar keeps "save it" on screen even when the phone keyboard is open */}
      <div className="save-bar">
        <button type="submit" className="save" disabled={saving}>
          {saving ? 'saving…' : 'save it'}
        </button>
      </div>
    </form>
  )
}