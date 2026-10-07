import { useEffect, useRef, useState } from 'react'
import { confetti } from '../confetti'
import { MOODS } from '../supabase'
import { todayISO } from '../utils'
import { MoodIcon, BackIcon } from './Icons'

// one form for both adding and editing: when `editing` is set, the fields fill in and "save" becomes "update"
export default function AddExpense({ open, onClose, onSave, editing, onUpdate, onCancelEdit }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [mood, setMood] = useState('food')
  const [date, setDate] = useState(todayISO())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const headSaveRef = useRef(null)
  const saveRef = useRef(null)

  // when a row is tapped, copy its values into the fields
  useEffect(() => {
    if (!editing) return
    setAmount(String(editing.amount))
    setNote(editing.note || '')
    setMood(editing.mood)
    setDate(editing.spent_on)
    setError('')
  }, [editing])

  function reset() {
    setAmount('')
    setNote('')
    setMood('food')
    setDate(todayISO())
    setError('')
  }

  function cancelEdit() {
    reset()
    onCancelEdit()
  }

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
      // the header button is hidden on desktop (offsetParent is null when display: none)
      const visibleButton = headSaveRef.current?.offsetParent ? headSaveRef.current : saveRef.current
      const fields = { amount: value, note: note.trim(), mood, spent_on: date }
      if (editing) await onUpdate(editing.id, fields)
      else await onSave(fields)
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
          aria-label="back to home"
          onClick={() => {
            if (editing) cancelEdit()
            onClose()
          }}
        >
          <BackIcon />
        </button>
        <h2>{editing ? 'edit expense' : 'new expense'}</h2>
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

      <div className="save-bar">
        <button type="submit" className="save" disabled={saving} ref={saveRef}>
          {saving ? 'saving…' : editing ? 'update it' : 'save it'}
        </button>
      </div>
    </form>
  )
}