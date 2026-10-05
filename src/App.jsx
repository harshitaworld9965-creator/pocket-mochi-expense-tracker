import { useEffect, useState } from 'react'
import { supabase, TABLE } from './supabase'
import { monthStartISO, greeting } from './utils'
import Sidebar from './components/Sidebar'
import TotalCard from './components/TotalCard'
import MoodTiles from './components/MoodTiles'
import RecentList from './components/RecentList'
import AddExpense from './components/AddExpense'
import { MochiFace, PlusIcon } from './components/Icons'

const newestFirst = (a, b) =>
  b.spent_on.localeCompare(a.spent_on) || b.created_at.localeCompare(a.created_at)

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  // load this month's spends once, when the app opens
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .gte('spent_on', monthStartISO())
        .order('spent_on', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) setError("couldn't load your spends. check your internet and refresh.")
      else setExpenses(data)
      setLoading(false)
    }
    load()
  }, [])

  async function addExpense(expense) {
    const { data, error } = await supabase.from(TABLE).insert(expense).select().single()
    if (error) throw error // AddExpense catches this and shows its own message
    if (data.spent_on >= monthStartISO()) {
      setExpenses((prev) => [data, ...prev].sort(newestFirst))
    }
    setShowAdd(false)
  }

  async function deleteExpense(id) {
    const before = expenses
    setExpenses((prev) => prev.filter((e) => e.id !== id)) // remove instantly
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) {
      setExpenses(before) // put it back if Supabase said no
      setError("couldn't delete that spend. try again.")
    }
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div className="app">
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      <div className="layout">
        <Sidebar expenses={expenses} />

        <main className="main">
          <header className="hello">
            <div>
              <p className="hello-small">{greeting()}</p>
              <h1>Harshita</h1>
            </div>
            <span className="avatar">
              <MochiFace />
            </span>
          </header>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <div className="top-row">
            <TotalCard total={total} />
            <MoodTiles expenses={expenses} />
          </div>

          <div className="bottom-row">
            <RecentList expenses={expenses} loading={loading} onDelete={deleteExpense} />
            <AddExpense open={showAdd} onClose={() => setShowAdd(false)} onSave={addExpense} />
          </div>
        </main>
      </div>

      <button className="fab" onClick={() => setShowAdd(true)}>
        <PlusIcon />
        add expense
      </button>
    </div>
  )
}