import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  settings?: {
    company_name?: string
    company_tagline?: string
    company_description?: string
    company_founded_year?: string
    company_email?: string
    rc_number?: string
    tin_number?: string
    head_office_city?: string
    head_office_address?: string
    head_office_phone?: string
    commercial_office_city?: string
    commercial_office_address?: string
    commercial_office_email?: string
    social_facebook?: string
    social_twitter?: string
    social_linkedin?: string
    social_instagram?: string
    show_social_links?: string
    show_compliance_bar?: string
  }
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  // Default values with settings override
  const companyName = settings?.company_name || 'Alak Oil & Gas'
  const companyDescription = settings?.company_description || "Nigeria's most transparent energy intermediary with full regulatory disclosure and verified credentials."
  const foundedYear = settings?.company_founded_year || '2018'
  const rcNumber = settings?.rc_number || '8867061'
  const tinNumber = settings?.tin_number || '33567270-0001'
  
  // Head Office
  const headOfficeCity = settings?.head_office_city || 'Abuja, FCT'
  const headOfficeAddress = settings?.head_office_address || 'Gwarimpa Estate, Opposite H Medix, Federal Capital Territory, Nigeria'
  const headOfficePhone = settings?.head_office_phone || '+234 XXX XXX XXXX'
  
  // Commercial Office
  const commercialOfficeCity = settings?.commercial_office_city || 'Lagos'
  const commercialOfficeAddress = settings?.commercial_office_address || 'No. 5 Lekki First Two, Lagos State, Nigeria'
  const commercialOfficeEmail = settings?.commercial_office_email || settings?.company_email || 'info@alakoilandgas.com'
  
  // Social Media
  const showSocialLinks = settings?.show_social_links !== 'false'
  const socialFacebook = settings?.social_facebook
  const socialTwitter = settings?.social_twitter
  const socialLinkedin = settings?.social_linkedin
  const socialInstagram = settings?.social_instagram
  const hasSocialLinks = showSocialLinks && (socialFacebook || socialTwitter || socialLinkedin || socialInstagram)
  
  // Feature toggles
  const showComplianceBar = settings?.show_compliance_bar !== 'false'

  return (
    <footer className="bg-navy-950 text-text-light-primary">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/images/logo/alak-logo-full.svg"
                alt="Alak Oil & Gas Logo"
                width={48}
                height={48}
                className="shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">
                  {companyName}
                </span>
                <span className="text-xs font-mono text-text-light-secondary">
                  RC: {rcNumber}
                </span>
              </div>
            </div>
            <p className="text-text-light-secondary text-sm leading-relaxed mb-4">
              {companyDescription}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 bg-success rounded-full" />
              <span className="text-text-light-secondary">Established {foundedYear}</span>
            </div>
            
            {/* Social Links */}
            {hasSocialLinks && (
              <div className="flex items-center gap-3 mt-6">
                {socialFacebook && (
                  <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-colors">
                    <Facebook size={16} />
                  </a>
                )}
                {socialTwitter && (
                  <a href={socialTwitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-colors">
                    <Twitter size={16} />
                  </a>
                )}
                {socialLinkedin && (
                  <a href={socialLinkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-colors">
                    <Linkedin size={16} />
                  </a>
                )}
                {socialInstagram && (
                  <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-colors">
                    <Instagram size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/services', label: 'Services & Products' },
                { href: '/compliance', label: 'Compliance & Credentials' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-light-secondary hover:text-gold-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Head Office */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Head Office</h3>
            <div className="space-y-4 text-sm text-text-light-secondary">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-500 mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-text-light-primary mb-1">{headOfficeCity}</p>
                  <p className="leading-relaxed">
                    {headOfficeAddress.split(',').map((part, i) => (
                      <span key={i}>{part.trim()}{i < headOfficeAddress.split(',').length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gold-500 shrink-0" />
                <a href={`tel:${headOfficePhone.replace(/\s/g, '')}`} className="hover:text-gold-500 transition-colors">
                  {headOfficePhone}
                </a>
              </div>
            </div>
          </div>

          {/* Commercial Office */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Commercial Office</h3>
            <div className="space-y-4 text-sm text-text-light-secondary">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-500 mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-text-light-primary mb-1">{commercialOfficeCity}</p>
                  <p className="leading-relaxed">
                    {commercialOfficeAddress.split(',').map((part, i) => (
                      <span key={i}>{part.trim()}{i < commercialOfficeAddress.split(',').length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gold-500 shrink-0" />
                <a 
                  href={`mailto:${commercialOfficeEmail}`} 
                  className="hover:text-gold-500 transition-colors"
                >
                  {commercialOfficeEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Bar */}
      {showComplianceBar && (
        <div className="border-t border-white/10 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm font-mono text-text-light-secondary">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-success rounded-full" />
                  RC: {rcNumber}
                </span>
                <span>|</span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-success rounded-full" />
                  TIN: {tinNumber}
                </span>
              </div>
              <div className="text-sm text-text-light-secondary">
                <Link href="/compliance" className="hover:text-gold-500 transition-colors">
                  View Compliance Documents →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-light-secondary">
            <p>
              © {currentYear} {companyName} Limited. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-gold-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gold-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
