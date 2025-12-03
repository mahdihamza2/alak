'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import {
  contactStep1Schema,
  contactStep2Schema,
  contactStep3Schema,
  contactFormSchema,
  categoryOptions,
  productTypeOptions,
  volumeUnitOptions,
  type ContactFormData,
} from '@/lib/validations'

interface ContactFormProps {
  onSuccess?: () => void
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      category: undefined,
      productType: undefined,
      estimatedVolume: '',
      volumeUnit: 'BBLs',
      message: '',
      agreeToTerms: false,
    },
    mode: 'onChange',
  })

  const { register, handleSubmit, formState: { errors }, trigger, watch } = form

  const validateStep = async (step: number) => {
    let isValid = false
    
    switch (step) {
      case 1:
        isValid = await trigger(['fullName', 'email', 'phone', 'companyName'])
        break
      case 2:
        isValid = await trigger(['category', 'productType', 'estimatedVolume', 'volumeUnit'])
        break
      case 3:
        isValid = await trigger(['message', 'agreeToTerms'])
        break
    }
    
    return isValid
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry')
      }

      setSubmitSuccess(true)
      onSuccess?.()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
          Inquiry Submitted Successfully
        </h3>
        <p className="text-neutral-600 mb-6">
          Thank you for your interest. Our team will review your inquiry and get back to you within 24-48 hours.
        </p>
        <Button onClick={() => { setSubmitSuccess(false); form.reset(); setCurrentStep(1); }}>
          Submit Another Inquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              {currentStep > step ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div
                className={`w-full h-1 mx-2 ${
                  currentStep > step ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
                style={{ width: '80px' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-sm text-neutral-500 mb-8 -mt-4">
        <span className={currentStep >= 1 ? 'text-primary-600 font-medium' : ''}>Your Details</span>
        <span className={currentStep >= 2 ? 'text-primary-600 font-medium' : ''}>Business Info</span>
        <span className={currentStep >= 3 ? 'text-primary-600 font-medium' : ''}>Message</span>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name *
            </label>
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="John Doe"
              error={errors.fullName?.message}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john@company.com"
              error={errors.email?.message}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
              Phone Number *
            </label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+234 803 XXX XXXX"
              error={errors.phone?.message}
            />
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700 mb-1">
              Company Name *
            </label>
            <Input
              id="companyName"
              {...register('companyName')}
              placeholder="ABC Oil & Gas Ltd"
              error={errors.companyName?.message}
            />
          </div>
        </div>
      )}

      {/* Step 2: Business Category */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Business Category *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {categoryOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors ${
                    watch('category') === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('category')}
                    value={option.value}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <span className="block font-medium text-neutral-900">
                      {option.label}
                    </span>
                    <span className="block text-sm text-neutral-500 mt-1">
                      {option.description}
                    </span>
                  </div>
                  {watch('category') === option.value && (
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="productType" className="block text-sm font-medium text-neutral-700 mb-1">
              Product Type *
            </label>
            <Select
              id="productType"
              {...register('productType')}
              error={errors.productType?.message}
            >
              <option value="">Select a product</option>
              {productTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="estimatedVolume" className="block text-sm font-medium text-neutral-700 mb-1">
                Estimated Volume *
              </label>
              <Input
                id="estimatedVolume"
                {...register('estimatedVolume')}
                placeholder="10,000"
                error={errors.estimatedVolume?.message}
              />
            </div>
            <div>
              <label htmlFor="volumeUnit" className="block text-sm font-medium text-neutral-700 mb-1">
                Unit *
              </label>
              <Select
                id="volumeUnit"
                {...register('volumeUnit')}
                error={errors.volumeUnit?.message}
              >
                {volumeUnitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Message */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
              Additional Information *
            </label>
            <Textarea
              id="message"
              {...register('message')}
              rows={6}
              placeholder="Please provide any additional details about your requirements, preferred delivery timeline, or specific quality specifications..."
              error={errors.message?.message}
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeToTerms"
              {...register('agreeToTerms')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mt-1"
            />
            <label htmlFor="agreeToTerms" className="ml-3 text-sm text-neutral-600">
              I agree to the{' '}
              <a href="/terms" className="text-primary-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {currentStep > 1 ? (
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <Button type="button" onClick={handleNext}>
            Next Step
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Inquiry'
            )}
          </Button>
        )}
      </div>
    </form>
  )
}
