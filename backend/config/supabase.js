import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false, // Prevents server-side session leaks
        autoRefreshToken: false
      }
    })
    console.log('Supabase client initialized successfully.')
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error.message)
  }
} else {
  console.log('Supabase configurations are missing. Supabase database service is currently disabled.')
}

export const isSupabaseConfigured = () => {
  return supabase !== null
}

export { supabase }
