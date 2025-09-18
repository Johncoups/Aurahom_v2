import { createClient } from '@supabase/supabase-js'

// Ensure environment variables are loaded
if (typeof window === 'undefined') {
  require('dotenv').config({ path: '.env.local' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
