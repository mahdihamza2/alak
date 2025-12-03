'use client';

import Image from 'next/image';

interface LogoProps {
  variant?: 'full' | 'dark' | 'light' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  companyName?: string;
  rcNumber?: string;
}

const sizeMap = {
  sm: { logo: 32, text: 'text-sm' },
  md: { logo: 40, text: 'text-base' },
  lg: { logo: 48, text: 'text-lg' },
  xl: { logo: 64, text: 'text-xl' },
};

export default function Logo({
  variant = 'full',
  size = 'md',
  className = '',
  showText = true,
  companyName = 'Alak Oil & Gas',
  rcNumber = '8867061',
}: LogoProps) {
  const { logo: logoSize, text: textSize } = sizeMap[size];

  const logoSrc = {
    full: '/images/logo/alak-logo-full.svg',
    dark: '/images/logo/alak-logo-dark.svg',
    light: '/images/logo/alak-logo-light.svg',
    icon: '/images/logo/alak-icon.svg',
  }[variant];

  const textColor = variant === 'light' ? 'text-white' : 'text-navy-950';
  const subTextColor = variant === 'light' ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src={logoSrc}
        alt="Alak Oil & Gas Logo"
        width={logoSize}
        height={logoSize}
        className="shrink-0"
        priority
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSize} leading-tight ${textColor}`}>
            {companyName}
          </span>
          <span className={`text-xs font-mono ${subTextColor}`}>
            RC: {rcNumber}
          </span>
        </div>
      )}
    </div>
  );
}
