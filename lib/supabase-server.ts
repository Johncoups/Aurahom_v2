import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Supabase client for server-side code (Server Actions, Route Handlers, Server Components).
 * Uses the user's session from cookies so RLS (auth.uid()) works correctly.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore when called from a Server Component (e.g. during render)
          }
        },
      },
    }
  )
}
