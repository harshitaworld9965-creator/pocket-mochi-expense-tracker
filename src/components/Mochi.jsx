// the mascot — its face follows how the month is going

export function mochiMood(pct) {
  if (pct >= 100) return 'worried'
  if (pct >= 75) return 'okay'
  return 'happy'
}

export default function Mochi({ mood = 'happy', size = 28 }) {
  return (
    <svg
      className={`mochi mochi-${mood}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={`mochi is ${mood}`}
    >
      <path d="M8 4.5c-1-1.5-3-1.5-3 0M16 4.5c1-1.5 3-1.5 3 0" />
      <path d="M5 11c0-4 3-7 7-7s7 3 7 7v3c0 1-1 2-2 2H7c-1 0-2-1-2-2z" />

      <g className="mochi-eyes">
        {mood === 'worried' ? (
          <path d="M8.5 11.3l2 1.2M15.5 11.3l-2 1.2" />
        ) : (
          <>
            <circle cx="9.5" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" />
          </>
        )}
      </g>

      {mood === 'happy' && <path d="M10 15.5c1 .8 3 .8 4 0" />}
      {mood === 'okay' && <path d="M10 15.5h4" />}
      {mood === 'worried' && <path d="M10 16c1-.8 3-.8 4 0" />}

      {mood === 'happy' && (
        <>
          <circle cx="7.6" cy="14.2" r=".9" fill="#ff8fab" stroke="none" />
          <circle cx="16.4" cy="14.2" r=".9" fill="#ff8fab" stroke="none" />
        </>
      )}
      {mood === 'worried' && (
        <path
          className="mochi-sweat"
          d="M19.5 8.5c.9 1.1.9 2.2 0 2.9-.9-.7-.9-1.8 0-2.9z"
          fill="#c9b6ff"
          strokeWidth="1.2"
        />
      )}
    </svg>
  )
}