import { z } from 'zod'

// Step 1: Personal & Company Information
export const contactStep1Schema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must be less than 200 characters'),
})

// Step 2: Business Category & Product Selection
export const contactStep2Schema = z.object({
  category: z.enum(['verified-buyer', 'verified-seller', 'strategic-partner'], {
    message: 'Please select a business category',
  }),
  productType: z.enum(['crude-oil', 'pms', 'ago', 'jet-fuel', 'multiple'], {
    message: 'Please select a product type',
  }),
  estimatedVolume: z
    .string()
    .min(1, 'Please enter an estimated volume')
    .max(50, 'Volume must be less than 50 characters'),
  volumeUnit: z.enum(['BBLs', 'MT', 'Liters'], {
    message: 'Please select a unit',
  }),
})

// Step 3: Message & Terms
export const contactStep3Schema = z.object({
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and privacy policy'),
  recaptchaToken: z
    .string()
    .optional(),
})

// Combined full form schema
export const contactFormSchema = contactStep1Schema
  .merge(contactStep2Schema)
  .merge(contactStep3Schema)

// Type exports
export type ContactStep1Data = z.infer<typeof contactStep1Schema>
export type ContactStep2Data = z.infer<typeof contactStep2Schema>
export type ContactStep3Data = z.infer<typeof contactStep3Schema>
export type ContactFormData = z.infer<typeof contactFormSchema>

// Category options for UI
export const categoryOptions = [
  { value: 'verified-buyer', label: 'Verified Buyer', description: 'I want to purchase petroleum products' },
  { value: 'verified-seller', label: 'Verified Seller', description: 'I want to supply petroleum products' },
  { value: 'strategic-partner', label: 'Strategic Partner', description: 'I want to explore business partnerships' },
] as const

// Product type options for UI
export const productTypeOptions = [
  { value: 'crude-oil', label: 'Crude Oil', grades: ['Bonny Light', 'Forcados', 'Qua Iboe'] },
  { value: 'pms', label: 'PMS (Petrol)', grades: ['Regular', 'Premium'] },
  { value: 'ago', label: 'AGO (Diesel)', grades: ['Standard', 'Low Sulfur'] },
  { value: 'jet-fuel', label: 'Jet Fuel', grades: ['Jet A-1', 'Aviation Gas'] },
  { value: 'multiple', label: 'Multiple Products', grades: [] },
] as const

// Volume unit options for UI
export const volumeUnitOptions = [
  { value: 'BBLs', label: 'Barrels (BBLs)' },
  { value: 'MT', label: 'Metric Tons (MT)' },
  { value: 'Liters', label: 'Liters' },
] as const
