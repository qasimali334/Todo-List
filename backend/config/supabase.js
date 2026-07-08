import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const clean = (val) => val ? val.trim().replace(/^['"]|['"]$/g, '').trim() : ''

const url = clean(process.env.SUPABASE_URL)
const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY)

export const supabase = url && key ? createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
}) : null

if (supabase) {
  console.log('Supabase client initialized successfully.')
} else {
  console.error('Supabase configurations are missing. Database service is disabled.')
}

export const isSupabaseConfigured = () => supabase !== null
