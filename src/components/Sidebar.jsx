import Mochi, { mochiMood, mochiLine } from './Mochi'
import { NAV_ITEMS } from './navItems'
import { streak } from '../utils'
import ThemeToggle from './ThemeToggle'

export default function Sidebar({ page, onNavigate, expenses, budgetPct, theme, onToggleTheme }) {
  const days = streak(expenses)
  const mood = mochiMood(budgetPct)

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="avatar">
          <Mochi mood={mood} />
        </span>
        Pocket Mochi
      </div>

      <p className="mochi-say">{mochiLine(mood)}</p>

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

      <ThemeToggle theme={theme} onToggle={onToggleTheme} className="side-theme" />

      <div className="streak">
        <p className="streak-label">streak</p>
        <strong>
          {days} day{days === 1 ? '' : 's'} logged
        </strong>
      </div>
    </aside>
  )
}