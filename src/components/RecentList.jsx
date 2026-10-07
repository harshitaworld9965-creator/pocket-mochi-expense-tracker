import ExpenseRow from './ExpenseRow'
import { RowSkeleton } from './Skeleton'
import EmptyDoodle from './EmptyDoodle'

const SHOW = 6

export default function RecentList({ expenses, loading, onEdit, onDelete, onSeeAll }) {
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

      {loading && <RowSkeleton />}

      {!loading && expenses.length === 0 && (
        <EmptyDoodle kind="purse">nothing logged this month yet. your first spend shows up here.</EmptyDoodle>
      )}

      {!loading &&
        visible.map((e, i) => (
          <ExpenseRow
            key={e.id}
            expense={e}
            onEdit={onEdit}
            onDelete={onDelete}
            style={{ animationDelay: `${i * 45}ms` }}
          />
        ))}
    </section>
  )
}