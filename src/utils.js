// Dates are stored as 'YYYY-MM-DD'. 'en-CA' formats a local date in exactly that shape.
const iso = (d) => d.toLocaleDateString('en-CA')

export const todayISO = () => iso(new Date())

export function monthStartISO() {
  const d = new Date()
  return iso(new Date(d.getFullYear(), d.getMonth(), 1))
}

export function daysLeftInMonth() {
  const d = new Date()
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  return lastDay - d.getDate()
}

export const monthName = () =>
  new Date().toLocaleDateString('en-IN', { month: 'long' }).toLowerCase()

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
export const rupees = (n) => '₹' + inr.format(n)

export function shortRupees(n) {
  if (n < 1000) return rupees(n)
  return '₹' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
}

export function dayLabel(dateISO) {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateISO === todayISO()) return 'today'
  if (dateISO === iso(yesterday)) return 'yesterday'
  const [y, m, d] = dateISO.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'good morning,'
  if (h < 17) return 'good afternoon,'
  return 'good evening,'
}

// How many days in a row (ending today, or yesterday if today is empty) have at least one spend
export function streak(expenses) {
  const days = new Set(expenses.map((e) => e.spent_on))
  const d = new Date()
  if (!days.has(iso(d))) d.setDate(d.getDate() - 1)
  let count = 0
  while (days.has(iso(d))) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}