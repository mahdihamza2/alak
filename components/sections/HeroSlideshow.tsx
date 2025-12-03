'use client';

import { useState, useEffect, useCallback } from 'react';

interface HeroSlideshowProps {
  images: string[];
  interval?: number;
  children: React.ReactNode;
}

export default function HeroSlideshow({ 
  images, 
  interval = 5000, 
  children 
}: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 500);
  }, [images.length]);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [goToNext, interval]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Slideshow Background Images */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
            index === currentIndex 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
          style={{ backgroundImage: `url('${image}')` }}
        />
      ))}

      {/* Gradient Overlays for professional look */}
      <div className="absolute inset-0 bg-linear-to-b from-navy-950/60 via-navy-950/50 to-navy-950/75" />
      <div className="absolute inset-0 bg-linear-to-r from-navy-950/40 via-transparent to-navy-950/30" />
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-navy-950/40" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`group relative h-2 rounded-full transition-all duration-500 ease-out ${
              index === currentIndex 
                ? 'w-10 bg-gold-500' 
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Glow effect for active indicator */}
            {index === currentIndex && (
              <span className="absolute inset-0 rounded-full bg-gold-500/50 blur-sm animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Progress bar for current slide */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div 
          className="h-full bg-linear-to-r from-gold-500 to-gold-400 transition-all ease-linear"
          style={{ 
            width: '100%',
            animation: `slideProgress ${interval}ms linear infinite`,
          }}
        />
      </div>

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
