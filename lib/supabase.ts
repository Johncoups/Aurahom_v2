import { createBrowserClient } from "@supabase/ssr"

// Ensure environment variables are loaded (server-side)
if (typeof window === "undefined") {
  require("dotenv").config({ path: ".env.local" })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase client for the browser (Client Components, auth context, etc.).
 * Uses cookies so the server can read the session in Server Actions and RLS works.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
