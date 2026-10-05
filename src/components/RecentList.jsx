import ExpenseRow from './ExpenseRow'

const SHOW = 6

export default function RecentList({ expenses, loading, onDelete, onSeeAll }) {
  const visible = expenses.slice(0, SHOW)

  return (
    <section className="recent">
      <div className="section-head">
        <h2 className="section-title">recent</h2>
        {expenses.length > SHOW && (
          <button className="link-btn" onClick={onSeeAll}>
            see all {expenses.length}
          </button>
        )}
      </div>

      {loading && <p className="empty">fetching your spends…</p>}

      {!loading && expenses.length === 0 && (
        <p className="empty">nothing logged this month yet. add your first spend and it shows up here.</p>
      )}

      {!loading && visible.map((e) => <ExpenseRow key={e.id} expense={e} onDelete={onDelete} />)}
    </section>
  )
}
