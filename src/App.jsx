import { useEffect, useState } from 'react'
import { DEFAULT_BUDGET } from './supabase'
import { fetchExpenses, insertExpense, removeExpense, loadSetting, saveSetting } from './api'
import { currentMonthRange } from './utils'
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

  return (
    <div className="app">
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      <div className="layout">
        <Sidebar page={page} onNavigate={navigate} expenses={expenses} />

        <main className="main">
          {error && (
            <div className="error" role="alert">
              <p>{error}</p>
              <button className="mini-btn ghost" onClick={() => setError('')}>ok</button>
            </div>
          )}

          {page === 'home' && (
            <Home
              expenses={expenses}
              loading={loading}
              budget={budget}
              onBudgetChange={changeBudget}
              onDelete={deleteExpense}
              onSave={addExpense}
              showAdd={sheet === 'expense'}
              onCloseAdd={() => setSheet(null)}
              onSeeAll={() => navigate('history')}
            />
          )}
          {page === 'history' && <History onDelete={deleteExpense} />}
          {page === 'stats' && <Stats budget={budget} />}
          {page === 'food' && <Food showAdd={sheet === 'meal'} onCloseAdd={() => setSheet(null)} />}
        </main>
      </div>

      <BottomNav page={page} onNavigate={navigate} onAdd={openAdd} />
    </div>
  )
}