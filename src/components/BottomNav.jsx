import { PlusIcon } from './Icons'
import { NAV_ITEMS } from './navItems'

// phone only — hidden on desktop by CSS
export default function BottomNav({ page, onNavigate, onAdd }) {
  return (
    <nav className="bottom-nav" aria-label="main">
      {NAV_ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className="tab"
          aria-current={page === id ? 'page' : undefined}
          onClick={() => onNavigate(id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
      <button className="tab-add" aria-label="add expense" onClick={onAdd}>
        <PlusIcon />
      </button>
    </nav>
  )
}
