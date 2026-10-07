import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing Supabase env vars — check your .env file')
}

export const supabase = createClient(url, key)

export const TABLE = 'mochi_expenses'
export const MEALS_TABLE = 'mochi_meals'
export const SETTINGS_TABLE = 'mochi_settings'

export const MOODS = [
  { id: 'food',     label: 'food',     color: '#ffd6e0' },
  { id: 'travel',   label: 'travel',   color: '#c9b6ff' },
  { id: 'shopping', label: 'shopping', color: '#b8f2d0' },
  { id: 'fun',      label: 'fun',      color: '#ffe9a8' },
  { id: 'home',     label: 'home',     color: '#ffd6e0' },
  { id: 'health',   label: 'health',   color: '#b8f2d0' },
  { id: 'bills',    label: 'bills',    color: '#c9b6ff' },
  { id: 'other',    label: 'other',    color: '#ffe9a8' },
]

export const MEALS = [
  { id: 'breakfast', label: 'breakfast', color: '#ffe9a8' },
  { id: 'lunch',     label: 'lunch',     color: '#b8f2d0' },
  { id: 'snacks',    label: 'snacks',    color: '#ffd6e0' },
  { id: 'dinner',    label: 'dinner',    color: '#c9b6ff' },
]

// used until the saved values load, or if they can't be loaded
export const DEFAULT_BUDGET = 15000
export const DEFAULT_CALORIES = 2000