'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  settings?: {
    company_name?: string
    rc_number?: string
  }
}

export default function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Settings with defaults
  const companyName = settings?.company_name || 'Alak Oil & Gas'
  const rcNumber = settings?.rc_number || '8867061'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/compliance', label: 'Compliance' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo/alak-logo-full.svg"
              alt="Alak Oil & Gas Logo"
              width={48}
              height={48}
              className="shrink-0"
              priority
            />
            <div className="flex flex-col">
              <span
                className={`font-bold text-lg leading-tight transition-colors ${
                  isScrolled ? 'text-navy-950' : 'text-white'
                }`}
              >
                {companyName}
              </span>
              <span
                className={`text-xs font-mono transition-colors ${
                  isScrolled ? 'text-slate-600' : 'text-slate-300'
                }`}
              >
                RC: {rcNumber}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:text-gold-500 ${
                  isScrolled ? 'text-slate-700' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'text-navy-950 hover:bg-slate-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-slate-200/20 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-medium transition-colors hover:text-gold-500 py-2 ${
                    isScrolled ? 'text-slate-700' : 'text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold rounded-lg transition-all duration-300 text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
