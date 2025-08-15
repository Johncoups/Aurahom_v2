import { supabase } from './supabase'
import { AuthError, User, Session } from '@supabase/supabase-js'

// Types for better error handling
export interface AuthResult {
  success: boolean
  user?: User | null
  session?: Session | null
  error?: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(data: SignUpData): Promise<AuthResult> {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        // Sent to auth.users.raw_user_meta_data. Our DB trigger reads these to create a profile row.
        data: { full_name: data.name }
      }
    })

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error)
      }
    }

    return {
      success: true,
      user: authData.user,
      session: authData.session
    }
  } catch (err) {
    return {
      success: false,
      error: 'An unexpected error occurred during registration'
    }
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signInWithEmail(data: SignInData): Promise<AuthResult> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error)
      }
    }

    return {
      success: true,
      user: authData.user,
      session: authData.session
    }
  } catch (err) {
    return {
      success: false,
      error: 'An unexpected error occurred during sign in'
    }
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error)
      }
    }

    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      error: 'An unexpected error occurred during sign out'
    }
  }
}

/**
 * Reset password for a user
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error)
      }
    }

    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      error: 'An unexpected error occurred during password reset'
    }
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error)
      }
    }

    return {
      success: true,
      user
    }
  } catch (err) {
    return {
      success: false,
      error: 'An unexpected error occurred while getting user'
    }
  }
}

/**
 * Get the current session
 */
export async function getCurrentSession(): Promise<AuthResult> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error)
      }
    }

    return {
      success: true,
      session
    }
  } catch (err) {
    return {
      success: false,
      error: 'An unexpected error occurred while getting session'
    }
  }
}

/**
 * Listen to authentication state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback)
}

/**
 * Convert Supabase auth errors to user-friendly messages
 */
function getErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.'
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link.'
    case 'User already registered':
      return 'An account with this email already exists.'
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.'
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.'
    case 'Signup is disabled':
      return 'New user registration is currently disabled.'
    case 'Too many requests':
      return 'Too many attempts. Please try again later.'
    default:
      return error.message || 'An authentication error occurred.'
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const result = await getCurrentUser()
  return result.success && !!result.user
}
