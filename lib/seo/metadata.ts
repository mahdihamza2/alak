import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alakoilandgas.com'
const COMPANY_NAME = 'Alak Oil and Gas Company Limited'
const DEFAULT_DESCRIPTION = 'CAC-registered Nigerian enterprise specializing in petroleum product trading, supply chain management, and strategic energy partnerships across West Africa.'

interface GenerateMetadataOptions {
  title: string
  description?: string
  path?: string
  ogImage?: string
  noIndex?: boolean
  keywords?: string[]
}

export function generatePageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  ogImage = '/images/og-image.jpg',
  noIndex = false,
  keywords = [],
}: GenerateMetadataOptions): Metadata {
  const fullTitle = `${title} | ${COMPANY_NAME}`
  const url = `${BASE_URL}${path}`

  const defaultKeywords = [
    'oil and gas Nigeria',
    'petroleum trading',
    'energy supply',
    'crude oil supplier',
    'AGO supplier Nigeria',
    'PMS supplier',
    'jet fuel Nigeria',
    'Nigerian oil company',
    'West Africa energy',
  ]

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: COMPANY_NAME }],
    creator: COMPANY_NAME,
    publisher: COMPANY_NAME,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: COMPANY_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - ${COMPANY_NAME}`,
        },
      ],
      locale: 'en_NG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }
}

// Pre-built metadata for main pages
export const homeMetadata = generatePageMetadata({
  title: 'Home',
  description: 'Alak Oil and Gas Company Limited - Your trusted partner in Nigerian petroleum trading. CAC-registered (RC: 8867061) supplier of crude oil, PMS, AGO, and jet fuel across West Africa.',
  path: '/',
  keywords: ['petroleum products Nigeria', 'oil trading company', 'energy sector Nigeria'],
})

export const aboutMetadata = generatePageMetadata({
  title: 'About Us',
  description: 'Learn about Alak Oil and Gas Company Limited - Established in 2018, we are a CAC-registered Nigerian enterprise committed to excellence in petroleum product trading.',
  path: '/about',
  keywords: ['about alak oil gas', 'Nigerian oil company history', 'energy company Nigeria'],
})

export const servicesMetadata = generatePageMetadata({
  title: 'Our Products & Services',
  description: 'Explore our petroleum product offerings including Crude Oil, PMS (Petrol), AGO (Diesel), and Jet Fuel. Premium quality products with reliable supply chain management.',
  path: '/services',
  keywords: ['petroleum products', 'crude oil supply', 'diesel supplier Nigeria', 'aviation fuel'],
})

export const complianceMetadata = generatePageMetadata({
  title: 'Compliance & Certifications',
  description: 'Alak Oil and Gas Company Limited operates with full CAC registration (RC: 8867061), FIRS Tax ID (TIN: 33567270-0001), and maintains strict compliance with Nigerian regulations.',
  path: '/compliance',
  keywords: ['CAC registered company', 'FIRS compliant', 'Nigerian business registration'],
})

export const contactMetadata = generatePageMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Alak Oil and Gas Company Limited. Offices in Abuja and Lagos. Request a quote for petroleum products or explore partnership opportunities.',
  path: '/contact',
  keywords: ['contact alak oil gas', 'petroleum quote request', 'oil supplier contact'],
})
