import { SunIcon, MoonIcon } from './Icons'

export default function ThemeToggle({ theme, onToggle, className = '' }) {
  const dark = theme === 'dark'
  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={onToggle}
      aria-label={dark ? 'switch to day mode' : 'switch to night mode'}
      title={dark ? 'day mode' : 'night mode'}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}