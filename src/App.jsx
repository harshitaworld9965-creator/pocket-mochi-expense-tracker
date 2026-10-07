import { useEffect, useState } from 'react'
import { DEFAULT_BUDGET } from './supabase'
import { fetchExpenses, insertExpense, updateExpense, removeExpense, loadSetting, saveSetting } from './api'
import { currentMonthRange, sumAmounts } from './utils'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import History from './pages/History'
import Stats from './pages/Stats'
import Food from './pages/Food'

const newestFirst = (a, b) =>
  b.spent_on.localeCompare(a.spent_on) || b.created_at.localeCompare(a.created_at)

export default function App() {
  const [page, setPage] = useState('home')
  const [expenses, setExpenses] = useState([]) // this month only
  const [budget, setBudget] = useState(DEFAULT_BUDGET)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sheet, setSheet] = useState(null) // which phone form is open: null, 'expense' or 'meal'
  const [editing, setEditing] = useState(null) // the expense being edited, or null

  useEffect(() => {
    const { from, to } = currentMonthRange()
    fetchExpenses(from, to)
      .then(setExpenses)
      .catch(() => setError("couldn't load your spends. check your internet and refresh."))
      .finally(() => setLoading(false))

    // if this fails we quietly keep the default budget
    loadSetting('monthly_budget', DEFAULT_BUDGET).then(setBudget).catch(() => {})
  }, [])

  function navigate(to) {
    setPage(to)
    setSheet(null)
    setEditing(null)
    window.scrollTo(0, 0)
  }

  // the + button: on the food page it adds food, everywhere else it jumps home and adds a spend
  function openAdd() {
    if (page === 'food') {
      setSheet('meal')
    } else {
      navigate('home')
      setSheet('expense')
    }
  }

  async function addExpense(expense) {
    const saved = await insertExpense(expense) // AddExpense catches errors itself
    if (saved.spent_on >= currentMonthRange().from) {
      setExpenses((prev) => [saved, ...prev].sort(newestFirst))
    }
    setSheet(null)
  }

  // tapping a row anywhere: go home, open the form with that spend in it
  function startEdit(expense) {
    navigate('home')
    setEditing(expense)
    setSheet('expense')
  }

  async function changeExpense(id, fields) {
    const saved = await updateExpense(id, fields) // AddExpense catches errors itself
    const from = currentMonthRange().from
    setExpenses((prev) =>
      prev
        .map((e) => (e.id === id ? saved : e))
        .filter((e) => e.spent_on >= from) // if you moved its date to an older month, it leaves this list
        .sort(newestFirst)
    )
    setEditing(null)
    setSheet(null)
  }

  // returns true/false so History knows whether to remove the row too
  async function deleteExpense(id) {
    const before = expenses
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    try {
      await removeExpense(id)
      return true
    } catch {
      setExpenses(before)
      setError("couldn't delete that spend. try again.")
      return false
    }
  }

  async function changeBudget(value) {
    const before = budget
    setBudget(value)
    try {
      await saveSetting('monthly_budget', value)
    } catch {
      setBudget(before)
      setError("couldn't save your new budget. try again.")
    }
  }

  const budgetPct = (sumAmounts(expenses) / budget) * 100

  return (
    <div className="app">
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      <div className="layout">
        <Sidebar page={page} onNavigate={navigate} expenses={expenses} budgetPct={budgetPct} />

        <main className="main">
          {error && (
            <div className="error" role="alert">
              <p>{error}</p>
              <button className="mini-btn ghost" onClick={() => setError('')}>ok</button>
            </div>
          )}

          {/* key={page} makes React rebuild this box on every page switch, which replays the entrance animation */}
          <div key={page} className="page">
          {page === 'home' && (
            <Home
              expenses={expenses}
              loading={loading}
              budget={budget}
              onBudgetChange={changeBudget}
              onEdit={startEdit}
              onDelete={deleteExpense}
              onSave={addExpense}
              editing={editing}
              onUpdate={changeExpense}
              onCancelEdit={() => setEditing(null)}
              showAdd={sheet === 'expense'}
              onCloseAdd={() => setSheet(null)}
              onSeeAll={() => navigate('history')}
            />
          )}
          {page === 'history' && <History onEdit={startEdit} onDelete={deleteExpense} />}
          {page === 'stats' && <Stats budget={budget} />}
          {page === 'food' && <Food showAdd={sheet === 'meal'} onOpenAdd={() => setSheet('meal')} onCloseAdd={() => setSheet(null)} />}
          </div>
        </main>
      </div>

      <BottomNav page={page} onNavigate={navigate} onAdd={openAdd} />
    </div>
  )
}