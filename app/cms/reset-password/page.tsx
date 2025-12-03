'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { resetPassword } from '@/app/cms/auth/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Eye, EyeOff, Check, X, Lock, ShieldCheck, Loader2 } from 'lucide-react'

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
]

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isValidToken, setIsValidToken] = useState(true)

  // Check for error in URL params (e.g., expired token)
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (errorParam) {
      setIsValidToken(false)
      setError(errorDescription || 'Invalid or expired reset link. Please request a new one.')
    }
  }, [searchParams])

  const getPasswordStrength = (): { score: number; label: string; color: string } => {
    const passedRequirements = passwordRequirements.filter(req => req.test(password)).length
    
    if (passedRequirements <= 1) return { score: 20, label: 'Very Weak', color: 'bg-red-500' }
    if (passedRequirements === 2) return { score: 40, label: 'Weak', color: 'bg-orange-500' }
    if (passedRequirements === 3) return { score: 60, label: 'Fair', color: 'bg-yellow-500' }
    if (passedRequirements === 4) return { score: 80, label: 'Good', color: 'bg-blue-500' }
    return { score: 100, label: 'Strong', color: 'bg-green-500' }
  }

  const strength = getPasswordStrength()
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const allRequirementsMet = passwordRequirements.every(req => req.test(password))
  const canSubmit = allRequirementsMet && passwordsMatch && isValidToken

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!canSubmit) return
    
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('password', password)
    formData.append('confirmPassword', confirmPassword)
    
    const result = await resetPassword(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
    // On success, the action redirects to dashboard
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                <X size={32} className="text-red-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              {error || 'This password reset link is invalid or has expired.'}
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-2xl border border-neutral-200 text-center">
            <p className="text-neutral-600 mb-6">
              Please request a new password reset link to continue.
            </p>
            <Link href="/cms/forgot-password">
              <Button className="w-full">
                Request New Link
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/cms/login"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/alak-logo-full.svg"
              alt="Alak Oil & Gas"
              width={64}
              height={64}
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Create a strong password for your account
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-2xl border border-neutral-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-500">Password Strength</span>
                    <span className={`text-xs font-medium ${
                      strength.score >= 80 ? 'text-green-600' : 
                      strength.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className={`mt-1 text-sm flex items-center gap-1 ${
                  passwordsMatch ? 'text-green-600' : 'text-red-600'
                }`}>
                  {passwordsMatch ? <Check size={14} /> : <X size={14} />}
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-neutral-50 rounded-xl p-4">
              <p className="text-sm font-medium text-neutral-700 mb-3">Password Requirements:</p>
              <ul className="space-y-2">
                {passwordRequirements.map((req, index) => {
                  const passed = req.test(password)
                  return (
                    <li key={index} className={`flex items-center gap-2 text-sm ${
                      passed ? 'text-green-600' : 'text-neutral-500'
                    }`}>
                      {passed ? (
                        <Check size={14} className="shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0" />
                      )}
                      {req.label}
                    </li>
                  )
                })}
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Password...
                </span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link
            href="/cms/login"
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            ← Back to login
          </Link>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-neutral-400">
            Your password will be securely encrypted
          </p>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/alak-logo-full.svg"
              alt="Alak Oil & Gas"
              width={64}
              height={64}
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Loading...
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow-lg rounded-2xl border border-neutral-200 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
