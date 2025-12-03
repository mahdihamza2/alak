/**
 * Oil Price Widget
 * 
 * A compact, real-time oil price display component for use on the homepage
 * or sidebar. Shows current prices for key benchmarks with trend indicators.
 * 
 * @component OilPriceWidget
 */

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { OilPrice, MarketTrend } from '@/lib/supabase/database.types'

// ============================================================================
// Types
// ============================================================================

interface OilPriceWidgetProps {
  variant?: 'compact' | 'full'
  className?: string
}

interface PriceDisplayProps {
  label: string
  price: number | null
  change: number | null
  changePercent: number | null
  unit?: string
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getLatestPrices(): Promise<OilPrice | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('oil_prices')
    .select('*')
    .order('price_date', { ascending: false })
    .limit(1)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}

// ============================================================================
// Helpers
// ============================================================================

function formatPrice(price: number | null): string {
  if (price === null) return '--'
  return price.toFixed(2)
}

function formatChange(change: number | null, changePercent: number | null): {
  display: string
  isPositive: boolean
  isNeutral: boolean
} {
  if (change === null || changePercent === null) {
    return { display: '--', isPositive: false, isNeutral: true }
  }
  
  const sign = change >= 0 ? '+' : ''
  const display = `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`
  
  return {
    display,
    isPositive: change > 0,
    isNeutral: change === 0,
  }
}

function getTrendIcon(trend: MarketTrend | null): React.ReactNode {
  switch (trend) {
    case 'bullish':
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    case 'bearish':
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    case 'volatile':
      return (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    default:
      return (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
      )
  }
}

function getTrendLabel(trend: MarketTrend | null): string {
  switch (trend) {
    case 'bullish':
      return 'Bullish'
    case 'bearish':
      return 'Bearish'
    case 'volatile':
      return 'Volatile'
    default:
      return 'Neutral'
  }
}

function getTrendColor(trend: MarketTrend | null): string {
  switch (trend) {
    case 'bullish':
      return 'text-green-600 bg-green-50'
    case 'bearish':
      return 'text-red-600 bg-red-50'
    case 'volatile':
      return 'text-amber-600 bg-amber-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// ============================================================================
// Sub-Components
// ============================================================================

function PriceCard({ label, price, change, changePercent, unit = '/bbl' }: PriceDisplayProps) {
  const changeInfo = formatChange(change, changePercent)
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          ${formatPrice(price)}
        </span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      <div className={`text-sm mt-1 font-medium ${
        changeInfo.isNeutral
          ? 'text-gray-500'
          : changeInfo.isPositive
            ? 'text-green-600'
            : 'text-red-600'
      }`}>
        {changeInfo.display}
      </div>
    </div>
  )
}

function CompactPriceRow({ label, price, change, changePercent }: PriceDisplayProps) {
  const changeInfo = formatChange(change, changePercent)
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-900">
          ${formatPrice(price)}
        </span>
        <span className={`text-xs font-medium ${
          changeInfo.isNeutral
            ? 'text-gray-500'
            : changeInfo.isPositive
              ? 'text-green-600'
              : 'text-red-600'
        }`}>
          {changeInfo.isPositive ? '↑' : changeInfo.isNeutral ? '–' : '↓'}
          {' '}
          {changePercent !== null ? `${Math.abs(changePercent).toFixed(2)}%` : '--'}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export async function OilPriceWidget({ variant = 'compact', className = '' }: OilPriceWidgetProps) {
  const priceData = await getLatestPrices()
  
  if (!priceData) {
    return (
      <div className={`bg-gray-50 rounded-xl p-6 ${className}`}>
        <p className="text-gray-500 text-center">Price data unavailable</p>
      </div>
    )
  }
  
  const lastUpdated = priceData.fetched_at
    ? new Date(priceData.fetched_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Dubai',
      })
    : 'Unknown'

  if (variant === 'full') {
    return (
      <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Oil Market Prices</h3>
            <p className="text-sm text-gray-400">Last updated: {lastUpdated} (Dubai)</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getTrendColor(priceData.market_trend as MarketTrend)}`}>
            {getTrendIcon(priceData.market_trend as MarketTrend)}
            <span className="text-sm font-medium">{getTrendLabel(priceData.market_trend as MarketTrend)}</span>
          </div>
        </div>
        
        {/* Price Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Brent Crude</div>
            <div className="text-2xl font-bold">${formatPrice(priceData.brent_price)}</div>
            <div className={`text-sm mt-1 ${
              (priceData.brent_change ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatChange(priceData.brent_change, priceData.brent_change_percent).display}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">WTI Crude</div>
            <div className="text-2xl font-bold">${formatPrice(priceData.wti_price)}</div>
            <div className={`text-sm mt-1 ${
              (priceData.wti_change ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatChange(priceData.wti_change, priceData.wti_change_percent).display}
            </div>
          </div>
        </div>
        
        {/* Additional Prices */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Dubai Crude</span>
            <span className="font-medium">${formatPrice(priceData.dubai_crude_price)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Bonny Light</span>
            <span className="font-medium">${formatPrice(priceData.bonny_light_price)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Natural Gas</span>
            <span className="font-medium">${formatPrice(priceData.natural_gas_price)}/MMBtu</span>
          </div>
        </div>
        
        {/* CTA */}
        <Link
          href="/blog?category=oil-prices"
          className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-gray-900 font-medium py-3 rounded-lg transition-colors"
        >
          View Market Analysis
        </Link>
      </div>
    )
  }
  
  // Compact variant
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Oil Prices</h3>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${getTrendColor(priceData.market_trend as MarketTrend)}`}>
          {getTrendIcon(priceData.market_trend as MarketTrend)}
          <span className="font-medium">{getTrendLabel(priceData.market_trend as MarketTrend)}</span>
        </div>
      </div>
      
      {/* Prices */}
      <div className="p-4">
        <CompactPriceRow
          label="Brent Crude"
          price={priceData.brent_price}
          change={priceData.brent_change}
          changePercent={priceData.brent_change_percent}
        />
        <CompactPriceRow
          label="WTI Crude"
          price={priceData.wti_price}
          change={priceData.wti_change}
          changePercent={priceData.wti_change_percent}
        />
        <CompactPriceRow
          label="Dubai Crude"
          price={priceData.dubai_crude_price}
          change={priceData.dubai_crude_change}
          changePercent={priceData.dubai_crude_change_percent}
        />
      </div>
      
      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Updated: {lastUpdated}</span>
        <Link
          href="/blog?category=oil-prices"
          className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
        >
          Full Analysis →
        </Link>
      </div>
    </div>
  )
}

// ============================================================================
// Ticker Component (for homepage banner)
// ============================================================================

export async function OilPriceTicker({ className = '' }: { className?: string }) {
  const priceData = await getLatestPrices()
  
  if (!priceData) return null
  
  const prices = [
    { label: 'Brent', price: priceData.brent_price, change: priceData.brent_change_percent },
    { label: 'WTI', price: priceData.wti_price, change: priceData.wti_change_percent },
    { label: 'Dubai', price: priceData.dubai_crude_price, change: priceData.dubai_crude_change_percent },
    { label: 'Bonny Light', price: priceData.bonny_light_price, change: priceData.bonny_light_change_percent },
    { label: 'Natural Gas', price: priceData.natural_gas_price, change: priceData.natural_gas_change_percent, unit: '/MMBtu' },
  ]
  
  return (
    <div className={`bg-gray-900 text-white overflow-hidden ${className}`}>
      <div className="flex animate-ticker">
        {[...prices, ...prices].map((item, index) => (
          <div key={index} className="flex items-center gap-6 px-6 py-2 whitespace-nowrap">
            <span className="text-sm text-gray-400">{item.label}</span>
            <span className="font-semibold">${formatPrice(item.price)}{item.unit || ''}</span>
            {item.change !== null && (
              <span className={`text-sm font-medium ${
                item.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change).toFixed(2)}%
              </span>
            )}
            <span className="text-gray-700">|</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OilPriceWidget
