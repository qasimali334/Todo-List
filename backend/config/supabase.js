import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const cleanEnvVar = (val, prefixToRemove) => {
  if (!val) return ''
  let cleaned = val.trim()
  // Remove variable name prefix if mistakenly included
  if (prefixToRemove && cleaned.startsWith(`${prefixToRemove}=`)) {
    cleaned = cleaned.substring(prefixToRemove.length + 1)
  }
  // Strip surrounding quotes
  cleaned = cleaned.replace(/^['"]|['"]$/g, '').trim()
  return cleaned
}

const supabaseUrl = cleanEnvVar(process.env.SUPABASE_URL, 'SUPABASE_URL')
const supabaseServiceKey = cleanEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY')

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
