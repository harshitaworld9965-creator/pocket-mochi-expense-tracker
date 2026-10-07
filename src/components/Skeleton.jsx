// shimmering placeholders shown while data loads

export function RowSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-list">
      <p className="sr-only" role="status">loading…</p>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="row skeleton-row" aria-hidden="true">
          <span className="sk sk-icon" />
          <span className="sk-text">
            <span className="sk sk-line" />
            <span className="sk sk-line short" />
          </span>
          <span className="sk sk-amount" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ height = 160 }) {
  return (
    <>
      <p className="sr-only" role="status">loading…</p>
      <div className="sk sk-card" style={{ height }} aria-hidden="true" />
    </>
  )
}