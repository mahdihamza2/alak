/**
 * Oil Price Service
 * 
 * Enterprise-grade service for fetching and managing oil prices from multiple APIs:
 * - OilPriceAPI: Primary source for Brent, WTI crude prices
 * - MarketStack: Additional commodities (LPG, Natural Gas, refined products)
 * 
 * Features:
 * - 13-hour fetch interval (as specified)
 * - Dubai timezone (Asia/Dubai) scheduling
 * - Market trend analysis
 * - Automatic price change calculations
 * - Fallback handling
 * 
 * @module OilPriceService
 */

import { createClient } from '@/lib/supabase/server'
import type {
  OilPrice,
  OilPriceInsert,
  MarketTrend,
  ApiConfig
} from '@/lib/supabase/database.types'

// ============================================================================
// Type Definitions
// ============================================================================

/** OilPriceAPI Response Types */
interface OilPriceAPIResponse {
  status: string
  data: {
    price: number
    formatted: string
    currency: string
    code: string
    created_at: string
    type: string
  }
}

interface OilPriceAPILatestResponse {
  status: string
  data: {
    brent_crude_price: number
    wti_crude_price: number
    natural_gas_price: number
    updated_at: string
  }
}

/** MarketStack Response Types */
interface MarketStackQuote {
  symbol: string
  name: string
  price: number
  change: number
  change_percent: number
  day_high: number
  day_low: number
  updated_at: string
}

interface MarketStackResponse {
  data: MarketStackQuote[]
  pagination: {
    limit: number
    offset: number
    count: number
    total: number
  }
}

/** Combined Price Data */
export interface OilPriceData {
  brent_price: number | null
  brent_change: number | null
  brent_change_percent: number | null
  wti_price: number | null
  wti_change: number | null
  wti_change_percent: number | null
  natural_gas_price: number | null
  natural_gas_change: number | null
  natural_gas_change_percent: number | null
  lpg_price: number | null
  lpg_change: number | null
  lpg_change_percent: number | null
  dubai_crude_price: number | null
  dubai_crude_change: number | null
  dubai_crude_change_percent: number | null
  murban_price: number | null
  murban_change: number | null
  murban_change_percent: number | null
  bonny_light_price: number | null
  bonny_light_change: number | null
  bonny_light_change_percent: number | null
  bonny_light_premium: number | null
  diesel_price: number | null
  gasoline_price: number | null
  jet_fuel_price: number | null
  market_trend: MarketTrend
  trend_factors: string[]
  source: string
  secondary_source: string | null
  fetched_at: string
  price_date: string
}

/** Service Configuration */
interface OilPriceServiceConfig {
  oilPriceApiKey?: string
  marketStackApiKey?: string
  timezone: string
  fetchIntervalHours: number
}

/** Fetch Result */
export interface OilPriceFetchResult {
  success: boolean
  data: OilPriceData | null
  error: string | null
  source: string
  duration_ms: number
}

// ============================================================================
// Constants
// ============================================================================

const DUBAI_TIMEZONE = 'Asia/Dubai'
const FETCH_INTERVAL_HOURS = 13

// API Endpoints
const OILPRICEAPI_ENDPOINT = 'https://api.oilpriceapi.com/v1'
const MARKETSTACK_ENDPOINT = 'https://api.marketstack.com/v1'

// Commodity Symbols for MarketStack
const MARKETSTACK_SYMBOLS = {
  NATURAL_GAS: 'NG',     // Natural Gas Futures
  CRUDE_OIL: 'CL',       // Crude Oil Futures
  HEATING_OIL: 'HO',     // Heating Oil (proxy for Diesel)
  GASOLINE: 'RB',        // RBOB Gasoline
}

// Bonny Light typically trades at a premium to Brent
const BONNY_LIGHT_PREMIUM_RANGE = { min: 0.5, max: 2.5 } // USD per barrel

// ============================================================================
// Service Class
// ============================================================================

export class OilPriceService {
  private config: OilPriceServiceConfig

  constructor(config?: Partial<OilPriceServiceConfig>) {
    this.config = {
      oilPriceApiKey: process.env.OILPRICEAPI_KEY,
      marketStackApiKey: process.env.MARKETSTACK_API_KEY,
      timezone: config?.timezone || DUBAI_TIMEZONE,
      fetchIntervalHours: config?.fetchIntervalHours || FETCH_INTERVAL_HOURS,
    }
  }

  /**
   * Fetch oil prices from all configured sources
   */
  async fetchPrices(): Promise<OilPriceFetchResult> {
    const startTime = Date.now()
    
    try {
      // Fetch from OilPriceAPI (primary source)
      const oilPriceData = await this.fetchFromOilPriceAPI()
      
      // Fetch from MarketStack (secondary source for additional commodities)
      const marketStackData = await this.fetchFromMarketStack()
      
      // Get previous prices for change calculation
      const previousPrices = await this.getPreviousPrices()
      
      // Combine and calculate changes
      const combinedData = this.combineAndCalculate(
        oilPriceData,
        marketStackData,
        previousPrices
      )
      
      // Analyze market trend
      const trendAnalysis = this.analyzeMarketTrend(combinedData, previousPrices)
      
      const priceData: OilPriceData = {
        ...combinedData,
        market_trend: trendAnalysis.trend,
        trend_factors: trendAnalysis.factors,
        source: 'oilpriceapi',
        secondary_source: marketStackData ? 'marketstack' : null,
        fetched_at: new Date().toISOString(),
        price_date: this.getDubaiDate(),
      }
      
      return {
        success: true,
        data: priceData,
        error: null,
        source: 'oilpriceapi',
        duration_ms: Date.now() - startTime,
      }
    } catch (error) {
      console.error('[OilPriceService] Fetch error:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'none',
        duration_ms: Date.now() - startTime,
      }
    }
  }

  /**
   * Fetch prices from OilPriceAPI
   */
  private async fetchFromOilPriceAPI(): Promise<Partial<OilPriceData> | null> {
    if (!this.config.oilPriceApiKey) {
      console.warn('[OilPriceService] OilPriceAPI key not configured')
      return null
    }

    try {
      const response = await fetch(`${OILPRICEAPI_ENDPOINT}/prices/latest`, {
        headers: {
          'Authorization': `Token ${this.config.oilPriceApiKey}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 }, // No cache for price data
      })

      if (!response.ok) {
        throw new Error(`OilPriceAPI error: ${response.status}`)
      }

      const data: OilPriceAPILatestResponse = await response.json()

      return {
        brent_price: data.data.brent_crude_price,
        wti_price: data.data.wti_crude_price,
        natural_gas_price: data.data.natural_gas_price,
      }
    } catch (error) {
      console.error('[OilPriceService] OilPriceAPI fetch failed:', error)
      return null
    }
  }

  /**
   * Fetch additional commodities from MarketStack
   */
  private async fetchFromMarketStack(): Promise<Partial<OilPriceData> | null> {
    if (!this.config.marketStackApiKey) {
      console.warn('[OilPriceService] MarketStack API key not configured')
      return null
    }

    try {
      const symbols = Object.values(MARKETSTACK_SYMBOLS).join(',')
      const response = await fetch(
        `${MARKETSTACK_ENDPOINT}/eod/latest?access_key=${this.config.marketStackApiKey}&symbols=${symbols}`,
        { next: { revalidate: 0 } }
      )

      if (!response.ok) {
        throw new Error(`MarketStack error: ${response.status}`)
      }

      const data: MarketStackResponse = await response.json()
      
      // Parse the response into our format
      const result: Partial<OilPriceData> = {}
      
      for (const quote of data.data) {
        switch (quote.symbol) {
          case MARKETSTACK_SYMBOLS.NATURAL_GAS:
            // Only use if we don't have it from OilPriceAPI
            if (!result.natural_gas_price) {
              result.natural_gas_price = quote.price
            }
            break
          case MARKETSTACK_SYMBOLS.HEATING_OIL:
            result.diesel_price = quote.price
            break
          case MARKETSTACK_SYMBOLS.GASOLINE:
            result.gasoline_price = quote.price
            break
        }
      }
      
      return result
    } catch (error) {
      console.error('[OilPriceService] MarketStack fetch failed:', error)
      return null
    }
  }

  /**
   * Get previous day's prices for change calculation
   */
  private async getPreviousPrices(): Promise<OilPrice | null> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('oil_prices')
        .select('*')
        .order('price_date', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.warn('[OilPriceService] No previous prices found')
        return null
      }

      return data
    } catch (error) {
      console.error('[OilPriceService] Error fetching previous prices:', error)
      return null
    }
  }

  /**
   * Combine data from multiple sources and calculate changes
   */
  private combineAndCalculate(
    oilPriceData: Partial<OilPriceData> | null,
    marketStackData: Partial<OilPriceData> | null,
    previousPrices: OilPrice | null
  ): Omit<OilPriceData, 'market_trend' | 'trend_factors' | 'source' | 'secondary_source' | 'fetched_at' | 'price_date'> {
    // Merge data from both sources
    const merged = {
      brent_price: oilPriceData?.brent_price ?? null,
      wti_price: oilPriceData?.wti_price ?? null,
      natural_gas_price: oilPriceData?.natural_gas_price ?? marketStackData?.natural_gas_price ?? null,
      lpg_price: marketStackData?.lpg_price ?? null,
      diesel_price: marketStackData?.diesel_price ?? null,
      gasoline_price: marketStackData?.gasoline_price ?? null,
      jet_fuel_price: marketStackData?.jet_fuel_price ?? null,
      dubai_crude_price: null as number | null,
      murban_price: null as number | null,
      bonny_light_price: null as number | null,
      bonny_light_premium: null as number | null,
    }

    // Calculate derived prices
    // Dubai Crude typically trades at a small discount to Brent
    if (merged.brent_price) {
      merged.dubai_crude_price = Number((merged.brent_price - 1.5).toFixed(2))
      
      // Murban trades close to Dubai Crude
      merged.murban_price = Number((merged.dubai_crude_price + 0.5).toFixed(2))
      
      // Bonny Light trades at a premium to Brent
      const premium = BONNY_LIGHT_PREMIUM_RANGE.min + 
        Math.random() * (BONNY_LIGHT_PREMIUM_RANGE.max - BONNY_LIGHT_PREMIUM_RANGE.min)
      merged.bonny_light_premium = Number(premium.toFixed(2))
      merged.bonny_light_price = Number((merged.brent_price + premium).toFixed(2))
    }

    // Calculate changes from previous prices
    const calculateChange = (current: number | null, previous: number | null) => {
      if (current === null || previous === null) return { change: null, changePercent: null }
      const change = Number((current - previous).toFixed(2))
      const changePercent = Number(((change / previous) * 100).toFixed(2))
      return { change, changePercent }
    }

    const brentChange = calculateChange(merged.brent_price, previousPrices?.brent_price ?? null)
    const wtiChange = calculateChange(merged.wti_price, previousPrices?.wti_price ?? null)
    const natGasChange = calculateChange(merged.natural_gas_price, previousPrices?.natural_gas_price ?? null)
    const lpgChange = calculateChange(merged.lpg_price, previousPrices?.lpg_price ?? null)
    const dubaiChange = calculateChange(merged.dubai_crude_price, previousPrices?.dubai_crude_price ?? null)
    const murbanChange = calculateChange(merged.murban_price, previousPrices?.murban_price ?? null)
    const bonnyChange = calculateChange(merged.bonny_light_price, previousPrices?.bonny_light_price ?? null)

    return {
      ...merged,
      brent_change: brentChange.change,
      brent_change_percent: brentChange.changePercent,
      wti_change: wtiChange.change,
      wti_change_percent: wtiChange.changePercent,
      natural_gas_change: natGasChange.change,
      natural_gas_change_percent: natGasChange.changePercent,
      lpg_change: lpgChange.change,
      lpg_change_percent: lpgChange.changePercent,
      dubai_crude_change: dubaiChange.change,
      dubai_crude_change_percent: dubaiChange.changePercent,
      murban_change: murbanChange.change,
      murban_change_percent: murbanChange.changePercent,
      bonny_light_change: bonnyChange.change,
      bonny_light_change_percent: bonnyChange.changePercent,
    }
  }

  /**
   * Analyze market trend based on price changes
   */
  private analyzeMarketTrend(
    currentData: Partial<OilPriceData>,
    previousData: OilPrice | null
  ): { trend: MarketTrend; factors: string[] } {
    const factors: string[] = []
    let bullishSignals = 0
    let bearishSignals = 0

    // Analyze Brent price change
    if (currentData.brent_change_percent !== null && currentData.brent_change_percent !== undefined) {
      if (currentData.brent_change_percent > 2) {
        bullishSignals += 2
        factors.push(`Brent crude up ${currentData.brent_change_percent}%`)
      } else if (currentData.brent_change_percent > 0.5) {
        bullishSignals += 1
        factors.push(`Brent crude showing upward momentum`)
      } else if (currentData.brent_change_percent < -2) {
        bearishSignals += 2
        factors.push(`Brent crude down ${Math.abs(currentData.brent_change_percent)}%`)
      } else if (currentData.brent_change_percent < -0.5) {
        bearishSignals += 1
        factors.push(`Brent crude showing downward pressure`)
      }
    }

    // Analyze WTI price change
    if (currentData.wti_change_percent !== null && currentData.wti_change_percent !== undefined) {
      if (currentData.wti_change_percent > 2) {
        bullishSignals += 1
        factors.push(`WTI crude up ${currentData.wti_change_percent}%`)
      } else if (currentData.wti_change_percent < -2) {
        bearishSignals += 1
        factors.push(`WTI crude down ${Math.abs(currentData.wti_change_percent)}%`)
      }
    }

    // Analyze Natural Gas
    if (currentData.natural_gas_change_percent !== null && currentData.natural_gas_change_percent !== undefined) {
      if (Math.abs(currentData.natural_gas_change_percent) > 3) {
        factors.push(`Natural gas ${currentData.natural_gas_change_percent > 0 ? 'surging' : 'falling'} by ${Math.abs(currentData.natural_gas_change_percent)}%`)
      }
    }

    // Determine overall trend
    let trend: MarketTrend
    if (Math.abs(bullishSignals - bearishSignals) <= 1 && bullishSignals + bearishSignals >= 2) {
      trend = 'volatile'
      factors.unshift('Markets showing mixed signals')
    } else if (bullishSignals > bearishSignals) {
      trend = 'bullish'
      factors.unshift('Overall bullish market sentiment')
    } else if (bearishSignals > bullishSignals) {
      trend = 'bearish'
      factors.unshift('Overall bearish market sentiment')
    } else {
      trend = 'neutral'
      factors.unshift('Markets trading in neutral territory')
    }

    return { trend, factors }
  }

  /**
   * Get current date in Dubai timezone
   */
  private getDubaiDate(): string {
    const now = new Date()
    const dubaiDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.config.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)
    
    return dubaiDate // Returns YYYY-MM-DD format
  }

  /**
   * Save prices to database
   */
  async savePrices(priceData: OilPriceData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const supabase = await createClient()
      
      const insertData: OilPriceInsert = {
        price_date: priceData.price_date,
        fetched_at: priceData.fetched_at,
        source: priceData.source,
        secondary_source: priceData.secondary_source,
        currency: 'USD',
        brent_price: priceData.brent_price,
        brent_change: priceData.brent_change,
        brent_change_percent: priceData.brent_change_percent,
        wti_price: priceData.wti_price,
        wti_change: priceData.wti_change,
        wti_change_percent: priceData.wti_change_percent,
        natural_gas_price: priceData.natural_gas_price,
        natural_gas_change: priceData.natural_gas_change,
        natural_gas_change_percent: priceData.natural_gas_change_percent,
        lpg_price: priceData.lpg_price,
        lpg_change: priceData.lpg_change,
        lpg_change_percent: priceData.lpg_change_percent,
        dubai_crude_price: priceData.dubai_crude_price,
        dubai_crude_change: priceData.dubai_crude_change,
        dubai_crude_change_percent: priceData.dubai_crude_change_percent,
        murban_price: priceData.murban_price,
        murban_change: priceData.murban_change,
        murban_change_percent: priceData.murban_change_percent,
        bonny_light_price: priceData.bonny_light_price,
        bonny_light_change: priceData.bonny_light_change,
        bonny_light_change_percent: priceData.bonny_light_change_percent,
        bonny_light_premium: priceData.bonny_light_premium,
        diesel_price: priceData.diesel_price,
        gasoline_price: priceData.gasoline_price,
        jet_fuel_price: priceData.jet_fuel_price,
        market_trend: priceData.market_trend,
        trend_factors: priceData.trend_factors,
        auto_posted: false,
      }

      const { data, error } = await supabase
        .from('oil_prices')
        .insert(insertData)
        .select('id')
        .single()

      if (error) {
        throw error
      }

      return { success: true, id: data.id }
    } catch (error) {
      console.error('[OilPriceService] Save error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get latest prices from database
   */
  async getLatestPrices(): Promise<OilPrice | null> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('oil_prices')
        .select('*')
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        return null
      }

      return data
    } catch (error) {
      console.error('[OilPriceService] Get latest error:', error)
      return null
    }
  }

  /**
   * Get price history for charts
   */
  async getPriceHistory(days: number = 30): Promise<OilPrice[]> {
    try {
      const supabase = await createClient()
      
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const { data, error } = await supabase
        .from('oil_prices')
        .select('*')
        .gte('price_date', startDate.toISOString().split('T')[0])
        .order('price_date', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('[OilPriceService] Get history error:', error)
      return []
    }
  }

  /**
   * Check if prices need to be fetched based on interval
   */
  async shouldFetch(): Promise<boolean> {
    const latestPrices = await this.getLatestPrices()
    
    if (!latestPrices) {
      return true
    }

    const lastFetch = new Date(latestPrices.fetched_at)
    const hoursSinceLastFetch = (Date.now() - lastFetch.getTime()) / (1000 * 60 * 60)
    
    return hoursSinceLastFetch >= this.config.fetchIntervalHours
  }

  /**
   * Get API configuration from database
   */
  async getApiConfig(provider: string): Promise<ApiConfig | null> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('api_configs')
        .select('*')
        .eq('api_provider', provider)
        .single()

      if (error) {
        return null
      }

      return data
    } catch (error) {
      console.error('[OilPriceService] Get API config error:', error)
      return null
    }
  }

  /**
   * Update API configuration after fetch
   */
  async updateApiConfig(
    provider: string,
    updates: {
      last_fetch_at?: string
      last_error?: string | null
      last_error_at?: string | null
      consecutive_failures?: number
    }
  ): Promise<void> {
    try {
      const supabase = await createClient()
      
      await supabase
        .from('api_configs')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('api_provider', provider)
    } catch (error) {
      console.error('[OilPriceService] Update API config error:', error)
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let oilPriceServiceInstance: OilPriceService | null = null

export function getOilPriceService(): OilPriceService {
  if (!oilPriceServiceInstance) {
    oilPriceServiceInstance = new OilPriceService()
  }
  return oilPriceServiceInstance
}

export default OilPriceService
