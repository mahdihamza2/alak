'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { resetPasswordRequest } from '@/app/cms/auth/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    const result = await resetPasswordRequest(formData)
    
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    
    setIsLoading(false)
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
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-2xl border border-neutral-200">
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email Address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@alakoilandgas.com"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
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
      </div>
    </div>
  )
}
