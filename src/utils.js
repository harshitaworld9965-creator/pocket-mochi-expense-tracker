// Dates are stored as 'YYYY-MM-DD'. 'en-CA' formats a local date in exactly that shape.
export const iso = (d) => d.toLocaleDateString('en-CA')

// 'YYYY-MM-DD' -> a local Date (new Date('2026-10-05') would be read as UTC and can shift a day)
export function parseISO(dateISO) {
  const [y, m, d] = dateISO.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayISO = () => iso(new Date())

export function addDays(dateISO, n) {
  const d = parseISO(dateISO)
  d.setDate(d.getDate() + n)
  return iso(d)
}

// the Monday of the week that dateISO falls in
export function weekStartISO(dateISO) {
  const d = parseISO(dateISO)
  const sinceMonday = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - sinceMonday)
  return iso(d)
}

export const weekdayShort = (dateISO) =>
  parseISO(dateISO).toLocaleDateString('en-IN', { weekday: 'short' }).toLowerCase()

// month is 0–11, like JavaScript's Date. `to` is the first day of the NEXT month.
export function monthRange(year, month) {
  return {
    from: iso(new Date(year, month, 1)),
    to: iso(new Date(year, month + 1, 1)),
  }
}

export function currentMonthRange() {
  const d = new Date()
  return monthRange(d.getFullYear(), d.getMonth())
}

export function daysLeftInMonth() {
  const d = new Date()
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  return lastDay - d.getDate()
}

export const monthName = () =>
  new Date().toLocaleDateString('en-IN', { month: 'long' }).toLowerCase()

export const monthLabel = (year, month) =>
  new Date(year, month, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toLowerCase()

export const shortMonth = (year, month) =>
  new Date(year, month, 1).toLocaleDateString('en-IN', { month: 'short' }).toLowerCase()

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
export const rupees = (n) => '₹' + inr.format(n)
export const kcal = (n) => inr.format(n) + ' kcal'

export function shortRupees(n) {
  if (n < 1000) return rupees(n)
  return '₹' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
}

export const sumAmounts = (list) => list.reduce((sum, e) => sum + Number(e.amount), 0)
export const sumCalories = (list) => list.reduce((sum, m) => sum + Number(m.calories), 0)

export function dayLabel(dateISO) {
  if (dateISO === todayISO()) return 'today'
  if (dateISO === addDays(todayISO(), -1)) return 'yesterday'
  return parseISO(dateISO)
    .toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
    .toLowerCase()
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'good morning,'
  if (h < 17) return 'good afternoon,'
  return 'good evening,'
}

// a sensible starting meal for the add-food form, based on the time of day
export function guessMeal() {
  const h = new Date().getHours()
  if (h < 11) return 'breakfast'
  if (h < 16) return 'lunch'
  if (h < 19) return 'snacks'
  return 'dinner'
}

// How many days in a row (ending today, or yesterday if today is empty) have at least one spend
export function streak(expenses) {
  const days = new Set(expenses.map((e) => e.spent_on))
  let d = todayISO()
  if (!days.has(d)) d = addDays(d, -1)
  let count = 0
  while (days.has(d)) {
    count++
    d = addDays(d, -1)
  }
  return count
}