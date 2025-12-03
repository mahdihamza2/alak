// JSON-LD Structured Data Schemas for SEO
// Reference: https://schema.org/

export interface OrganizationSchema {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  alternateName?: string
  url: string
  logo?: string
  description?: string
  foundingDate?: string
  founders?: PersonSchema[]
  address?: PostalAddressSchema | PostalAddressSchema[]
  contactPoint?: ContactPointSchema[]
  sameAs?: string[]
  taxID?: string
  legalName?: string
}

export interface LocalBusinessSchema {
  '@context': 'https://schema.org'
  '@type': 'LocalBusiness'
  '@id': string
  name: string
  description?: string
  url: string
  telephone?: string
  email?: string
  address: PostalAddressSchema
  geo?: GeoCoordinatesSchema
  openingHoursSpecification?: OpeningHoursSchema[]
  priceRange?: string
  image?: string
}

export interface PostalAddressSchema {
  '@type': 'PostalAddress'
  streetAddress: string
  addressLocality: string
  addressRegion?: string
  postalCode?: string
  addressCountry: string
}

export interface GeoCoordinatesSchema {
  '@type': 'GeoCoordinates'
  latitude: number
  longitude: number
}

export interface ContactPointSchema {
  '@type': 'ContactPoint'
  telephone: string
  contactType: string
  email?: string
  areaServed?: string | string[]
  availableLanguage?: string | string[]
}

export interface OpeningHoursSchema {
  '@type': 'OpeningHoursSpecification'
  dayOfWeek: string[]
  opens: string
  closes: string
}

export interface PersonSchema {
  '@type': 'Person'
  name: string
  jobTitle?: string
  url?: string
  sameAs?: string[]
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: BreadcrumbItemSchema[]
}

export interface BreadcrumbItemSchema {
  '@type': 'ListItem'
  position: number
  name: string
  item?: string
}

export interface WebPageSchema {
  '@context': 'https://schema.org'
  '@type': 'WebPage'
  '@id': string
  url: string
  name: string
  description?: string
  isPartOf: {
    '@id': string
  }
  breadcrumb?: BreadcrumbSchema
}

export interface FAQSchema {
  '@context': 'https://schema.org'
  '@type': 'FAQPage'
  mainEntity: FAQItemSchema[]
}

export interface FAQItemSchema {
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}

// ============================================
// Pre-built Schema Generators
// ============================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alakoilandgas.com'

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Alak Oil and Gas Company Limited',
    legalName: 'Alak Oil and Gas Company Limited',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description: 'CAC-registered Nigerian enterprise specializing in petroleum product trading, supply chain management, and strategic energy partnerships across West Africa.',
    foundingDate: '2018',
    taxID: '33567270-0001',
    founders: [
      {
        '@type': 'Person',
        name: 'Kabiru Jibril',
        jobTitle: 'Managing Director / CEO',
      },
      {
        '@type': 'Person',
        name: 'Aliyu Ahmad Sunusi',
        jobTitle: 'Director',
      },
    ],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Block A, Plot 123, Gwarimpa Estate',
        addressLocality: 'Abuja',
        addressRegion: 'FCT',
        addressCountry: 'Nigeria',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Suite 45, Golden Plaza, Lekki Phase 1',
        addressLocality: 'Lagos',
        addressRegion: 'Lagos State',
        addressCountry: 'Nigeria',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+234-803-XXX-XXXX',
        contactType: 'sales',
        email: 'info@alakoilandgas.com',
        areaServed: ['NG', 'GH', 'SN', 'CI'],
        availableLanguage: ['English', 'French'],
      },
    ],
    sameAs: [
      'https://linkedin.com/company/alak-oil-gas',
    ],
  }
}

export function generateLocalBusinessSchema(office: 'abuja' | 'lagos'): LocalBusinessSchema {
  const offices = {
    abuja: {
      id: `${BASE_URL}/#abuja-office`,
      name: 'Alak Oil and Gas - Abuja Office',
      telephone: '+234-803-XXX-XXXX',
      email: 'abuja@alakoilandgas.com',
      address: {
        '@type': 'PostalAddress' as const,
        streetAddress: 'Block A, Plot 123, Gwarimpa Estate',
        addressLocality: 'Abuja',
        addressRegion: 'FCT',
        addressCountry: 'Nigeria',
      },
      geo: {
        '@type': 'GeoCoordinates' as const,
        latitude: 9.0820,
        longitude: 7.4951,
      },
    },
    lagos: {
      id: `${BASE_URL}/#lagos-office`,
      name: 'Alak Oil and Gas - Lagos Office',
      telephone: '+234-805-XXX-XXXX',
      email: 'lagos@alakoilandgas.com',
      address: {
        '@type': 'PostalAddress' as const,
        streetAddress: 'Suite 45, Golden Plaza, Lekki Phase 1',
        addressLocality: 'Lagos',
        addressRegion: 'Lagos State',
        addressCountry: 'Nigeria',
      },
      geo: {
        '@type': 'GeoCoordinates' as const,
        latitude: 6.4474,
        longitude: 3.4704,
      },
    },
  }

  const officeData = offices[office]

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': officeData.id,
    name: officeData.name,
    description: 'Petroleum product trading and supply chain management office',
    url: BASE_URL,
    telephone: officeData.telephone,
    email: officeData.email,
    address: officeData.address,
    geo: officeData.geo,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    priceRange: '$$$',
    image: `${BASE_URL}/images/office-${office}.jpg`,
  }
}

export function generateBreadcrumbSchema(items: { name: string; url?: string }[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${BASE_URL}${item.url}` : undefined,
    })),
  }
}

export function generateWebPageSchema(
  path: string,
  name: string,
  description: string
): WebPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}${path}#webpage`,
    url: `${BASE_URL}${path}`,
    name,
    description,
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
  }
}

// ============================================
// JSON-LD Component Helper
// ============================================

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
