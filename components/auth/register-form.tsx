"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react"
import { TermsOfService } from "./terms-of-service"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showTerms, setShowTerms] = useState(false)

  const isPasswordValid = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    )
  }

  const doPasswordsMatch = password === confirmPassword

  const isFormValid = name && email && isPasswordValid(password) && doPasswordsMatch && acceptTerms

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError("")

    try {
      // TODO: Implement Supabase registration
      console.log("Registration attempt:", { name, email, password, acceptTerms })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // TODO: Redirect to login or dashboard after successful registration
      console.log("Registration successful!")
      
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Create Your Account
        </h2>
        <p className="text-slate-600">
          Join Aurahom and start building your dream home today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => e.target.checkValidity()}
              placeholder="Enter your full name"
              className={`pl-10 border-gray-200 focus:border-cyan-800 focus:ring-cyan-800 ${
                name && name.length < 2 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              required
              minLength={2}
            />
          </div>
          {/* Name validation feedback */}
          {name && name.length < 2 && (
            <div className="text-xs text-red-500">
              ✗ Name must be at least 2 characters
            </div>
          )}
        </div>

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
              onBlur={(e) => e.target.checkValidity()}
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
              placeholder="Create a strong password"
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password
          </Label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={(e) => e.target.checkValidity()}
              placeholder="Confirm your password"
              className={`pl-10 pr-10 border-gray-200 focus:border-cyan-800 focus:ring-cyan-800 ${
                confirmPassword && !doPasswordsMatch ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {/* Password match validation */}
          {confirmPassword && (
            <div className="text-xs">
              {doPasswordsMatch ? (
                <span className="text-green-500">✓ Passwords match</span>
              ) : (
                <span className="text-red-500">✗ Passwords do not match</span>
              )}
            </div>
          )}
        </div>

        {/* Terms of Service */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            className="mt-1"
          />
          <div className="space-y-1">
            <Label htmlFor="terms" className="text-sm text-slate-600">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-cyan-800 hover:text-cyan-600 underline"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-cyan-800 hover:text-cyan-600 underline"
              >
                Privacy Policy
              </button>
            </Label>
          </div>
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
          disabled={isLoading || !isFormValid}
          className="w-full bg-cyan-800 hover:bg-cyan-700 text-white py-3 text-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* Sign In Link */}
      <div className="text-center mt-6">
        <p className="text-slate-600">
          Already have an account?{" "}
          <a
            href="#login"
            className="text-cyan-800 hover:text-cyan-600 font-medium transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>

      {/* Terms of Service Modal */}
      <TermsOfService 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
      />
    </div>
  )
}
