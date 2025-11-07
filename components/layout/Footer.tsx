import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-text-light-primary">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center font-bold text-navy-950 text-xl">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">
                  Alak Oil & Gas
                </span>
                <span className="text-xs font-mono text-text-light-secondary">
                  RC: 8867061
                </span>
              </div>
            </div>
            <p className="text-text-light-secondary text-sm leading-relaxed mb-4">
              Nigeria's most transparent energy intermediary with full regulatory disclosure and verified credentials.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 bg-success rounded-full" />
              <span className="text-text-light-secondary">Established 2018</span>
            </div>
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

          {/* Head Office - Abuja */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Head Office</h3>
            <div className="space-y-4 text-sm text-text-light-secondary">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-light-primary mb-1">Abuja, FCT</p>
                  <p className="leading-relaxed">
                    Gwarimpa Estate, Opposite H Medix,<br />
                    Federal Capital Territory, Nigeria
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gold-500 flex-shrink-0" />
                <a href="tel:+234" className="hover:text-gold-500 transition-colors">
                  +234 XXX XXX XXXX
                </a>
              </div>
            </div>
          </div>

          {/* Commercial Office - Lagos */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Commercial Office</h3>
            <div className="space-y-4 text-sm text-text-light-secondary">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-light-primary mb-1">Lagos</p>
                  <p className="leading-relaxed">
                    No. 5 Lekki First Two,<br />
                    Lagos State, Nigeria
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gold-500 flex-shrink-0" />
                <a 
                  href="mailto:info@alakoilandgas.com" 
                  className="hover:text-gold-500 transition-colors"
                >
                  info@alakoilandgas.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Bar */}
      <div className="border-t border-white/10 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm font-mono text-text-light-secondary">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-success rounded-full" />
                RC: 8867061
              </span>
              <span>|</span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-success rounded-full" />
                TIN: 33567270-0001
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

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-light-secondary">
            <p>
              © {currentYear} Alak Oil and Gas Company Limited. All rights reserved.
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
