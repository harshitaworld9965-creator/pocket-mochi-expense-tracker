import { MochiFace } from './Icons'
import { streak } from '../utils'

export default function Sidebar({ expenses }) {
  const days = streak(expenses)

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="avatar">
          <MochiFace />
        </span>
        Pocket Mochi
      </div>

      <div className="streak">
        <p className="streak-label">streak</p>
        <strong>
          {days} day{days === 1 ? '' : 's'} logged
        </strong>
      </div>
    </aside>
  )
}
