"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { resetPasswordUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address")
      return
    }
    
    setIsLoading(true)
    setError("")

    try {
      const result = await resetPasswordUser(email)
      if (!result.success) {
        setError(result.error || "Failed to send reset email. Please try again.")
        return
      }
      setIsSubmitted(true)
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-slate-600">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <Button
            onClick={() => {
              setIsSubmitted(false)
              setEmail("")
            }}
            variant="outline"
            className="w-full border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white"
          >
            Try Again
          </Button>
          
          <a
            href="/login"
            className="block text-sm text-cyan-800 hover:text-cyan-600 transition-colors"
          >
            ← Back to Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-slate-600">
          No worries! Enter your email and we'll send you reset instructions.
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
          className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 text-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="text-center mt-6">
        <a
          href="/login"
          className="inline-flex items-center text-sm text-cyan-800 hover:text-cyan-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sign In
        </a>
      </div>
    </div>
  )
}
