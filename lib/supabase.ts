import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Only create client if properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "your_supabase_url" &&
  supabaseAnonKey !== "your_supabase_anon_key" &&
  supabaseUrl.includes("supabase.co")
)

// Singleton client
let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!)
  }

  return supabaseClient
}

export function isSupabaseAvailable(): boolean {
  return isSupabaseConfigured
}
