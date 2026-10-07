import { supabase, TABLE, MEALS_TABLE, SETTINGS_TABLE } from './supabase'

// every Supabase call lives here, so pages and components never talk to the database directly

/* ---------- expenses ---------- */

// spends from fromISO (included) up to toISO (not included), newest first
export async function fetchExpenses(fromISO, toISO) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .gte('spent_on', fromISO)
    .lt('spent_on', toISO)
    .order('spent_on', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function insertExpense(expense) {
  const { data, error } = await supabase.from(TABLE).insert(expense).select().single()
  if (error) throw error
  return data
}

export async function removeExpense(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

/* ---------- meals ---------- */

// meals from fromISO (included) up to toISO (not included), in the order you ate them
export async function fetchMeals(fromISO, toISO) {
  const { data, error } = await supabase
    .from(MEALS_TABLE)
    .select('*')
    .gte('eaten_on', fromISO)
    .lt('eaten_on', toISO)
    .order('eaten_on', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function insertMeal(meal) {
  const { data, error } = await supabase.from(MEALS_TABLE).insert(meal).select().single()
  if (error) throw error
  return data
}

export async function removeMeal(id) {
  const { error } = await supabase.from(MEALS_TABLE).delete().eq('id', id)
  if (error) throw error
}

/* ---------- settings (budget, calorie goal) ---------- */

export async function loadSetting(key, fallback) {
  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (error) throw error
  return data ? Number(data.value) : fallback
}

export async function saveSetting(key, value) {
  const { error } = await supabase.from(SETTINGS_TABLE).upsert({ key, value })
  if (error) throw error
}