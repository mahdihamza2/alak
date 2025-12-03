'use client'

import { useEffect, useState } from 'react'
import { db, OilPrice } from '@/lib/supabase/client'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Fuel,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils/helpers'

export default function PricingPage() {
  const [latestPrice, setLatestPrice] = useState<OilPrice | null>(null)
  const [priceHistory, setPriceHistory] = useState<OilPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 14 | 30>(7)

  useEffect(() => {
    fetchData()
  }, [selectedPeriod])

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const [latest, history] = await Promise.all([
        db.oilPrices.getLatest(),
        db.oilPrices.getHistory(selectedPeriod),
      ])

      setLatestPrice(latest)
      setPriceHistory(history)
    } catch (error) {
      console.error('Error fetching oil prices:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getTrendIcon = (change: number | null) => {
    if (!change) return <Minus size={16} className="text-neutral-400" />
    if (change > 0) return <TrendingUp size={16} className="text-green-600" />
    return <TrendingDown size={16} className="text-red-600" />
  }

  const getTrendColor = (change: number | null) => {
    if (!change || change === 0) return 'text-neutral-600'
    return change > 0 ? 'text-green-600' : 'text-red-600'
  }

  const formatPrice = (price: number | null) => {
    if (!price) return '-'
    return `$${price.toFixed(2)}`
  }

  const formatChange = (change: number | null, changePercent: number | null) => {
    if (!change && !changePercent) return '-'
    const sign = (change ?? 0) >= 0 ? '+' : ''
    return `${sign}${change?.toFixed(2) ?? '0.00'} (${sign}${changePercent?.toFixed(2) ?? '0.00'}%)`
  }

  const getMarketTrendBadge = (trend: string | null) => {
    const config: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'error' }> = {
      bullish: { label: 'Bullish', variant: 'success' },
      bearish: { label: 'Bearish', variant: 'error' },
      neutral: { label: 'Neutral', variant: 'default' },
      volatile: { label: 'Volatile', variant: 'warning' },
    }
    const c = config[trend || 'neutral'] || { label: trend || 'Unknown', variant: 'default' as const }
    return <Badge variant={c.variant}>{c.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading oil prices...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Oil Prices"
        description="Real-time oil price monitoring and market trends"
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchData(true)}
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </>
        }
      />

      {!latestPrice ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Fuel size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No price data available</h3>
          <p className="text-neutral-500 max-w-sm mx-auto mb-4">
            Oil price data will appear here once the API starts fetching prices.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg p-3 max-w-md mx-auto">
            <AlertCircle size={16} />
            <span>Configure API keys in Settings to enable automatic price fetching</span>
          </div>
        </div>
      ) : (
        <>
          {/* Last Update Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Last Updated</p>
                <p className="text-sm text-blue-700">
                  {formatDateTime(latestPrice.fetched_at)} (Dubai Time: {latestPrice.dubai_time || 'N/A'})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700">Source:</span>
              <span className="font-medium text-blue-900">{latestPrice.source || 'OilPriceAPI'}</span>
            </div>
          </div>

          {/* Market Trend Overview */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <Activity size={20} />
                Market Overview
              </h2>
              {getMarketTrendBadge(latestPrice.market_trend)}
            </div>
            {latestPrice.trend_factors && latestPrice.trend_factors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {latestPrice.trend_factors.map((factor, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            )}
            {latestPrice.analyst_notes && (
              <p className="text-neutral-600 mt-3 text-sm">{latestPrice.analyst_notes}</p>
            )}
          </div>

          {/* Price Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {/* Brent Crude */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Fuel size={18} className="text-amber-600" />
                  </div>
                  <span className="font-medium text-neutral-900">Brent Crude</span>
                </div>
                {getTrendIcon(latestPrice.brent_change)}
              </div>
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {formatPrice(latestPrice.brent_price)}
              </p>
              <p className={`text-sm font-medium ${getTrendColor(latestPrice.brent_change)}`}>
                {formatChange(latestPrice.brent_change, latestPrice.brent_change_percent)}
              </p>
            </div>

            {/* WTI Crude */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Fuel size={18} className="text-blue-600" />
                  </div>
                  <span className="font-medium text-neutral-900">WTI Crude</span>
                </div>
                {getTrendIcon(latestPrice.wti_change)}
              </div>
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {formatPrice(latestPrice.wti_price)}
              </p>
              <p className={`text-sm font-medium ${getTrendColor(latestPrice.wti_change)}`}>
                {formatChange(latestPrice.wti_change, latestPrice.wti_change_percent)}
              </p>
            </div>

            {/* Dubai Crude */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Fuel size={18} className="text-purple-600" />
                  </div>
                  <span className="font-medium text-neutral-900">Dubai Crude</span>
                </div>
                {getTrendIcon(latestPrice.dubai_crude_change)}
              </div>
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {formatPrice(latestPrice.dubai_crude_price)}
              </p>
              <p className={`text-sm font-medium ${getTrendColor(latestPrice.dubai_crude_change)}`}>
                {formatChange(latestPrice.dubai_crude_change, latestPrice.dubai_crude_change_percent)}
              </p>
            </div>

            {/* Bonny Light */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Fuel size={18} className="text-green-600" />
                  </div>
                  <span className="font-medium text-neutral-900">Bonny Light</span>
                </div>
                {getTrendIcon(latestPrice.bonny_light_change)}
              </div>
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {formatPrice(latestPrice.bonny_light_price)}
              </p>
              <p className={`text-sm font-medium ${getTrendColor(latestPrice.bonny_light_change)}`}>
                {formatChange(latestPrice.bonny_light_change, latestPrice.bonny_light_change_percent)}
              </p>
              {latestPrice.bonny_light_premium && (
                <p className="text-xs text-neutral-500 mt-1">
                  Premium: ${latestPrice.bonny_light_premium.toFixed(2)}
                </p>
              )}
            </div>

            {/* Murban */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Fuel size={18} className="text-orange-600" />
                  </div>
                  <span className="font-medium text-neutral-900">Murban</span>
                </div>
                {getTrendIcon(latestPrice.murban_change)}
              </div>
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {formatPrice(latestPrice.murban_price)}
              </p>
              <p className={`text-sm font-medium ${getTrendColor(latestPrice.murban_change)}`}>
                {formatChange(latestPrice.murban_change, latestPrice.murban_change_percent)}
              </p>
            </div>

            {/* Natural Gas */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Activity size={18} className="text-cyan-600" />
                  </div>
                  <span className="font-medium text-neutral-900">Natural Gas</span>
                </div>
                {getTrendIcon(latestPrice.natural_gas_change)}
              </div>
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {formatPrice(latestPrice.natural_gas_price)}
              </p>
              <p className={`text-sm font-medium ${getTrendColor(latestPrice.natural_gas_change)}`}>
                {formatChange(latestPrice.natural_gas_change, latestPrice.natural_gas_change_percent)}
              </p>
            </div>

            {/* LPG */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Activity size={18} className="text-pink-600" />
                  </div>
                  <span className="font-medium text-neutral-900">LPG</span>
                </div>
                {getTrendIcon(latestPrice.lpg_change)}
              </div>
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {formatPrice(latestPrice.lpg_price)}
              </p>
              <p className={`text-sm font-medium ${getTrendColor(latestPrice.lpg_change)}`}>
                {formatChange(latestPrice.lpg_change, latestPrice.lpg_change_percent)}
              </p>
            </div>

            {/* Refined Products */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <DollarSign size={18} className="text-indigo-600" />
                  </div>
                  <span className="font-medium text-neutral-900">Refined Products</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Diesel</span>
                  <span className="font-medium">{formatPrice(latestPrice.diesel_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Gasoline</span>
                  <span className="font-medium">{formatPrice(latestPrice.gasoline_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Jet Fuel</span>
                  <span className="font-medium">{formatPrice(latestPrice.jet_fuel_price)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price History */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Price History
                </h2>
                <p className="text-sm text-neutral-500">Historical price data</p>
              </div>
              <div className="flex items-center gap-2">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setSelectedPeriod(days as 7 | 14 | 30)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === days
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {days}D
                  </button>
                ))}
              </div>
            </div>

            {priceHistory.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-neutral-500">No historical data available for the selected period</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Brent
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        WTI
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Dubai
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Bonny Light
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Natural Gas
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {priceHistory.slice().reverse().map((price) => (
                      <tr key={price.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Calendar size={14} />
                            <span className="text-sm font-medium">{price.price_date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium">{formatPrice(price.brent_price)}</span>
                          <span className={`text-xs ml-1 ${getTrendColor(price.brent_change_percent)}`}>
                            {price.brent_change_percent ? `${price.brent_change_percent >= 0 ? '+' : ''}${price.brent_change_percent.toFixed(2)}%` : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium">{formatPrice(price.wti_price)}</span>
                          <span className={`text-xs ml-1 ${getTrendColor(price.wti_change_percent)}`}>
                            {price.wti_change_percent ? `${price.wti_change_percent >= 0 ? '+' : ''}${price.wti_change_percent.toFixed(2)}%` : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium">{formatPrice(price.dubai_crude_price)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium">{formatPrice(price.bonny_light_price)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium">{formatPrice(price.natural_gas_price)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getMarketTrendBadge(price.market_trend)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
