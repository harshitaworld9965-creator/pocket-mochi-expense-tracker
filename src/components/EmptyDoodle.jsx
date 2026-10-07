// a little mochi with something empty — used wherever there's nothing to show yet

const props = {
  purse: (
    <>
      <path d="M86 52h26l-3 22H89z" fill="#ffd6e0" />
      <path d="M92 52v-4a7 7 0 0 1 14 0v4" />
      <circle cx="99" cy="62" r="2" fill="#3d2b3f" stroke="none" />
    </>
  ),
  bowl: (
    <>
      <path d="M84 56h32c0 10-7 17-16 17s-16-7-16-17z" fill="#b8f2d0" />
      <path d="M90 56c2-5 18-5 20 0" />
    </>
  ),
  calendar: (
    <>
      <rect x="86" y="46" width="28" height="26" rx="6" fill="#c9b6ff" />
      <path d="M86 55h28M94 42v8M106 42v8" />
    </>
  ),
  chart: (
    <>
      <rect x="86" y="62" width="7" height="12" rx="2.5" fill="#ffe9a8" />
      <rect x="97" y="54" width="7" height="20" rx="2.5" fill="#c9b6ff" />
      <rect x="108" y="60" width="7" height="14" rx="2.5" fill="#ffd6e0" />
    </>
  ),
}

export default function EmptyDoodle({ kind = 'purse', children }) {
  return (
    <div className="empty doodle">
      <svg
        viewBox="0 0 120 90"
        width="160"
        height="120"
        aria-hidden="true"
        fill="none"
        stroke="#3d2b3f"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g className="doodle-mochi">
          <circle cx="30" cy="30" r="8" fill="#ffffff" />
          <circle cx="66" cy="30" r="8" fill="#ffffff" />
          <circle cx="30" cy="30" r="3.5" fill="#ffd6e0" stroke="none" />
          <circle cx="66" cy="30" r="3.5" fill="#ffd6e0" stroke="none" />
          <rect x="18" y="30" width="60" height="44" rx="22" fill="#ffffff" />
          <circle cx="38" cy="52" r="2.3" fill="#3d2b3f" stroke="none" />
          <circle cx="58" cy="52" r="2.3" fill="#3d2b3f" stroke="none" />
          <circle cx="30" cy="59" r="3.2" fill="#ffd6e0" stroke="none" />
          <circle cx="66" cy="59" r="3.2" fill="#ffd6e0" stroke="none" />
          <path d="M44 61c2 1.5 6 1.5 8 0" />
        </g>
        {props[kind] ?? props.purse}
      </svg>
      <p>{children}</p>
    </div>
  )
}