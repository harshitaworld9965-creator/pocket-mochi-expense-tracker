import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing Supabase env vars — check your .env file')
}

export const supabase = createClient(url, key)

export const TABLE = 'mochi_expenses'

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

export const MONTHLY_BUDGET = 15000