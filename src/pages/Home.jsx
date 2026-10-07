import TotalCard from '../components/TotalCard'
import MoodTiles from '../components/MoodTiles'
import RecentList from '../components/RecentList'
import AddExpense from '../components/AddExpense'
import Mochi, { mochiMood, mochiLine } from '../components/Mochi'
import { greeting, sumAmounts } from '../utils'

export default function Home({
  expenses, loading, budget, onBudgetChange,
  onDelete, onSave, showAdd, onCloseAdd, onSeeAll,
}) {
  const total = sumAmounts(expenses)
  const mood = mochiMood((total / budget) * 100)

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

      <div className="top-row">
        <TotalCard total={total} budget={budget} onBudgetChange={onBudgetChange} />
        <MoodTiles expenses={expenses} />
      </div>

      <div className="bottom-row">
        <RecentList expenses={expenses} loading={loading} onDelete={onDelete} onSeeAll={onSeeAll} />
        <AddExpense open={showAdd} onClose={onCloseAdd} onSave={onSave} />
      </div>
    </>
  )
}