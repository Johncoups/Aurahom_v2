"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isPasswordValid = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // TODO: Implement Supabase authentication
      console.log("Login attempt:", { email, password, rememberMe })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (err) {
      setError("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-slate-600">
          Sign in to continue building your dream home
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => e.currentTarget.reportValidity()}
              placeholder="Enter your email"
              className={`pl-10 border-gray-200 focus:border-cyan-800 focus:ring-cyan-800 ${
                email && !email.includes('@') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              required
            />
          </div>
          {/* Email validation feedback */}
          {email && !email.includes('@') && (
            <div className="text-xs text-red-500">
              ✗ Please enter a valid email address
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => e.target.checkValidity()}
              placeholder="Enter your password"
              className={`pl-10 pr-10 border-gray-200 focus:border-cyan-800 focus:ring-cyan-800 ${
                password && !isPasswordValid(password) ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {/* Password validation feedback */}
          {password && (
            <div className="text-xs space-y-1">
              <div className={password.length >= 8 ? 'text-green-500' : 'text-red-500'}>
                {password.length >= 8 ? '✓' : '✗'} At least 8 characters
              </div>
              <div className={/[A-Z]/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/[A-Z]/.test(password) ? '✓' : '✗'} One uppercase letter
              </div>
              <div className={/[a-z]/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/[a-z]/.test(password) ? '✓' : '✗'} One lowercase letter
              </div>
              <div className={/\d/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/\d/.test(password) ? '✓' : '✗'} One number
              </div>
              <div className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '✗'} One special character
              </div>
            </div>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm text-slate-600">
              Remember me
            </Label>
          </div>
          <a
            href="#forgot-password"
            className="text-sm text-cyan-800 hover:text-cyan-600 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-800 hover:bg-cyan-700 text-white py-3 text-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center mt-6">
        <p className="text-slate-600">
          Don't have an account?{" "}
          <a
            href="#register"
            className="text-cyan-800 hover:text-cyan-600 font-medium transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
