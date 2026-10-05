import { supabase, TABLE, SETTINGS_TABLE, DEFAULT_BUDGET } from './supabase'

// every Supabase call lives here, so pages and components never talk to the database directly

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

export async function loadBudget() {
  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select('value')
    .eq('key', 'monthly_budget')
    .maybeSingle()
  if (error) throw error
  return data ? Number(data.value) : DEFAULT_BUDGET
}

export async function saveBudget(value) {
  const { error } = await supabase
    .from(SETTINGS_TABLE)
    .upsert({ key: 'monthly_budget', value })
  if (error) throw error
}