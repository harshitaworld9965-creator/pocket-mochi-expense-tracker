import Mochi, { mochiMood } from './Mochi'
import { NAV_ITEMS } from './navItems'
import { streak } from '../utils'

export default function Sidebar({ page, onNavigate, expenses, budgetPct }) {
  const days = streak(expenses)

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="avatar">
          <Mochi mood={mochiMood(budgetPct)} />
        </span>
        Pocket Mochi
      </div>

      <nav className="side-nav" aria-label="main">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className="side-link"
            aria-current={page === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      <div className="streak">
        <p className="streak-label">streak</p>
        <strong>
          {days} day{days === 1 ? '' : 's'} logged
        </strong>
      </div>
    </aside>
  )
}