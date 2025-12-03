import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Alak Oil and Gas Company Limited | Verified Gateway to Global Energy Transactions",
    template: "%s | Alak Oil and Gas"
  },
  description: "Nigeria's most transparent energy intermediary. Full regulatory disclosure (RC: 8867061, TIN: 33567270-0001), verified credentials, and intelligent buyer-seller matching for crude oil and refined products.",
  keywords: [
    "oil and gas nigeria",
    "crude oil intermediary",
    "energy trading nigeria",
    "verified oil buyers",
    "verified oil sellers",
    "petroleum products",
    "diesel",
    "jet fuel",
    "gasoline",
    "alak oil and gas",
    "RC 8867061",
    "lagos oil company",
    "abuja oil company"
  ],
  authors: [{ name: "Alak Oil and Gas Company Limited" }],
  creator: "Alak Oil and Gas Company Limited",
  publisher: "Alak Oil and Gas Company Limited",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://alakoilandgas.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'Alak Oil and Gas Company Limited',
    title: 'Alak Oil and Gas | Verified Gateway to Global Energy Transactions',
    description: 'Nigeria\'s most transparent energy intermediary with full regulatory disclosure and verified credentials.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Alak Oil and Gas Company Limited',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alak Oil and Gas | Verified Gateway to Global Energy Transactions',
    description: 'Nigeria\'s most transparent energy intermediary with full regulatory disclosure.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
