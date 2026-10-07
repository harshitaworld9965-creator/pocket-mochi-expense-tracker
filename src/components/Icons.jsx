function Svg({ size = 24, strokeWidth = 2.2, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const moodPaths = {
  food: (
    <>
      <path d="M4 10h16l-1.5 9a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5z" />
      <path d="M8 10a4 4 0 0 1 8 0" />
    </>
  ),
  travel: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <circle cx="7.5" cy="18" r="2" />
      <circle cx="16.5" cy="18" r="2" />
      <path d="M3 11h18" />
    </>
  ),
  shopping: (
    <>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </>
  ),
  fun: <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />,
  home: (
    <>
      <path d="M4 20V9l8-5 8 5v11z" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  health: <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z" />,
  bills: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M4 10h16" />
      <path d="M8 3v4M16 3v4" />
    </>
  ),
  other: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
}

export function MoodIcon({ mood, size = 24 }) {
  return <Svg size={size}>{moodPaths[mood] ?? moodPaths.other}</Svg>
}

const mealPaths = {
  breakfast: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </>
  ),
  lunch: moodPaths.food,
  snacks: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="14.5" cy="9.5" r="1" fill="currentColor" />
      <circle cx="13" cy="14.5" r="1" fill="currentColor" />
    </>
  ),
  dinner: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
}

export function MealIcon({ meal, size = 24 }) {
  return <Svg size={size}>{mealPaths[meal] ?? mealPaths.lunch}</Svg>
}

export const FoodIcon = () => (
  <Svg size={22}>
    <path d="M12 7.5c-2-2-6.5-1.5-6.5 3.5 0 5 3 9.5 6.5 9.5s6.5-4.5 6.5-9.5c0-5-4.5-5.5-6.5-3.5z" />
    <path d="M12 7.5c0-2 1-3.5 3-4" />
  </Svg>
)

export const HomeIcon = () => <Svg size={22}>{moodPaths.home}</Svg>
export const CalendarIcon = () => <Svg size={22}>{moodPaths.bills}</Svg>

export const ChartIcon = () => (
  <Svg size={22}>
    <path d="M5 20V11M12 20V5M19 20v-8" />
  </Svg>
)

export const SunIcon = () => (
  <Svg size={22}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
  </Svg>
)

export const MoonIcon = () => (
  <Svg size={22}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </Svg>
)

export const PlusIcon = () => (
  <Svg size={24} strokeWidth={2.8}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const BackIcon = () => (
  <Svg size={22} strokeWidth={2.6}>
    <path d="M15 6l-6 6 6 6" />
  </Svg>
)

export const NextIcon = () => (
  <Svg size={22} strokeWidth={2.6}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
)

export const PencilIcon = () => (
  <Svg size={16} strokeWidth={2.4}>
    <path d="M4 20l4-1L19 8l-3-3L5 16z" />
  </Svg>
)

export const TrashIcon = () => (
  <Svg size={20}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </Svg>
)

export const MochiFace = () => (
  <Svg size={28}>
    <path d="M5 11c0-4 3-7 7-7s7 3 7 7v3c0 1-1 2-2 2H7c-1 0-2-1-2-2z" />
    <circle cx="9.5" cy="12" r="1" fill="currentColor" />
    <circle cx="14.5" cy="12" r="1" fill="currentColor" />
    <path d="M10 15.5c1 .8 3 .8 4 0" />
    <path d="M8 4.5c-1-1.5-3-1.5-3 0M16 4.5c1-1.5 3-1.5 3 0" />
  </Svg>
)