'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface HomeHeroProps {
  rcNumber: string;
  tinNumber: string;
  foundedYear: string;
  headOfficeCity: string;
  commercialOfficeCity: string;
}

const heroImages = [
  '/images/refinery_image (1).jpg',
  '/images/refinery_image (2).jpg',
  '/images/refinery_image (3).jpg',
  '/images/refinery_image (4).jpg',
  '/images/refinery_image (5).jpg',
  '/images/refinery_image (6).jpg',
];

export default function HomeHero({
  rcNumber,
  tinNumber,
  foundedYear,
  headOfficeCity,
  commercialOfficeCity,
}: HomeHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const interval = 6000; // 6 seconds per slide

  // Ensure component is mounted before showing dynamic content
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  // Auto-advance slides - seamless infinite loop
  useEffect(() => {
    if (!isMounted) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [goToNext, interval, isMounted]);

  // Memoize the active index for SSR consistency
  const activeIndex = useMemo(() => (isMounted ? currentIndex : 0), [isMounted, currentIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow Background Images - Clean automatic transitions */}
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
            index === activeIndex 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-8000 ease-out"
            style={{ 
              backgroundImage: `url('${image}')`,
              transform: index === activeIndex ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        </div>
      ))}

      {/* Lighter Gradient Overlays - More image visibility */}
      <div className="absolute inset-0 bg-linear-to-b from-navy-950/50 via-navy-950/30 to-navy-950/60" />
      <div className="absolute inset-0 bg-linear-to-r from-navy-950/40 via-transparent to-navy-950/40" />
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(10, 25, 47, 0.3) 100%)'
      }} />

      {/* Content */}
      <div className="max-w-5xl mx-auto text-center relative z-10 px-6">
        {/* Trust Badges - Clean minimal style without glassmorphism */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-10 text-sm font-mono">
          <span className="flex items-center gap-2 text-white/90">
            <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            RC: {rcNumber}
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="flex items-center gap-2 text-white/90">
            <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            TIN: {tinNumber}
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-white/70">
            Est. {foundedYear}
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-white/70">
            {headOfficeCity} & {commercialOfficeCity}
          </span>
        </div>

        {/* Main Headline - Enhanced typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
          <span className="drop-shadow-2xl">Your Verified Gateway to</span>
          <br />
          <span className="bg-linear-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent drop-shadow-2xl">
            Global Energy Transactions
          </span>
        </h1>

        {/* Subheadline - Better readability */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-14 leading-relaxed font-light">
          Nigeria's most transparent energy intermediary. Full regulatory disclosure, 
          verified credentials, and intelligent buyer-seller matching for crude oil and refined products.
        </p>

        {/* CTA Buttons - Refined styling */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/compliance"
            className="group px-10 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_50px_rgba(255,183,77,0.35)] hover:-translate-y-0.5 flex items-center text-lg"
          >
            Verify Our Credentials
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link 
            href="/contact"
            className="group px-10 py-4 border-2 border-white/60 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm flex items-center text-lg"
          >
            <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors" />
            Begin Partnership Inquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
