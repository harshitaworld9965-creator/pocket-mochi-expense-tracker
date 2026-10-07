import { useEffect, useState } from 'react'
import { fetchExpenses } from '../api'
import TotalCard from '../components/TotalCard'
import MoodTiles from '../components/MoodTiles'
import RecentList from '../components/RecentList'
import AddExpense from '../components/AddExpense'
import MonthReview from '../components/MonthReview'
import Mochi, { mochiMood, mochiLine } from '../components/Mochi'
import { greeting, sumAmounts, lastMonth, monthRange } from '../utils'

const REVIEW_DAYS = 10 // show last month's review for the first 10 days of a month
const DISMISS_KEY = 'mochi-review-dismissed'

export default function Home({
  expenses, loading, budget, onBudgetChange,
  onEdit, onDelete, onSave, editing, onUpdate, onCancelEdit,
  showAdd, onCloseAdd, onSeeAll,
}) {
  const [review, setReview] = useState(null)

  const total = sumAmounts(expenses)
  const mood = mochiMood((total / budget) * 100)

  useEffect(() => {
    const { y, m } = lastMonth()
    const key = `${y}-${m}`
    let dismissed = ''
    try { dismissed = localStorage.getItem(DISMISS_KEY) || '' } catch { /* private mode etc. */ }
    if (new Date().getDate() > REVIEW_DAYS || dismissed === key) return

    const { from, to } = monthRange(y, m)
    fetchExpenses(from, to)
      .then((list) => list.length > 0 && setReview({ list, y, m, key }))
      .catch(() => {}) // the review is a bonus; if it fails, nothing shows
  }, [])

  function dismissReview() {
    try { localStorage.setItem(DISMISS_KEY, review.key) } catch { /* ignore */ }
    setReview(null)
  }

  return (
    <>
      <header className="hello">
        <div>
          <p className="hello-small">{greeting()}</p>
          <h1>Harshita</h1>
        </div>
        <span className="avatar mochi-wrap">
          <Mochi mood={mood} />
          <span className="mochi-say mochi-say-bubble">{mochiLine(mood)}</span>
        </span>
      </header>

      {review && (
        <MonthReview
          expenses={review.list}
          year={review.y}
          month={review.m}
          budget={budget}
          onDismiss={dismissReview}
        />
      )}

      <div className="top-row">
        <TotalCard total={total} budget={budget} onBudgetChange={onBudgetChange} />
        <MoodTiles expenses={expenses} />
      </div>

      <div className="bottom-row">
        <RecentList expenses={expenses} loading={loading} onEdit={onEdit} onDelete={onDelete} onSeeAll={onSeeAll} />
        <AddExpense
          open={showAdd}
          onClose={onCloseAdd}
          onSave={onSave}
          editing={editing}
          onUpdate={onUpdate}
          onCancelEdit={onCancelEdit}
        />
      </div>
    </>
  )
}