/**
 * Cron API Route: Fetch Oil Prices
 * 
 * Automated endpoint for fetching oil prices from OilPriceAPI and MarketStack.
 * Called by Vercel Cron every 13 hours.
 * 
 * Security:
 * - Validates CRON_SECRET header for authorized access
 * - Rate limited to prevent abuse
 * - Logs all execution attempts
 * 
 * @route GET /api/cron/fetch-prices
 */

import { NextRequest, NextResponse } from 'next/server'
import { getOilPriceService } from '@/lib/services'
import { createClient } from '@/lib/supabase/server'

// Vercel cron secret for authorization
const CRON_SECRET = process.env.CRON_SECRET

/**
 * Validate cron authorization
 */
function validateCronRequest(request: NextRequest): boolean {
  // In development, allow requests without secret
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !CRON_SECRET) {
    return false
  }
  
  return authHeader === `Bearer ${CRON_SECRET}`
}

/**
 * Log job execution to database
 */
async function logJobExecution(
  jobId: string,
  status: 'success' | 'error',
  durationMs: number,
  pricesFetched?: { market_trend?: string | null; brent_price?: number | null; wti_price?: number | null },
  errorMessage?: string
): Promise<void> {
  try {
    const supabase = await createClient()
    
    await supabase.from('job_execution_logs').insert({
      job_id: jobId,
      job_name: 'fetch-oil-prices',
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      status,
      duration_ms: durationMs,
      prices_fetched: pricesFetched ? JSON.parse(JSON.stringify(pricesFetched)) : null,
      records_processed: pricesFetched ? 1 : 0,
      records_created: pricesFetched ? 1 : 0,
      error_message: errorMessage,
      triggered_by: 'cron',
    })
  } catch (error) {
    console.error('[Cron/FetchPrices] Failed to log execution:', error)
  }
}

/**
 * Get or create the fetch-prices job record
 */
async function getJobRecord(): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    // Find existing job
    const { data: existingJob } = await supabase
      .from('scheduled_jobs')
      .select('id')
      .eq('job_name', 'fetch-oil-prices')
      .single()
    
    if (existingJob) {
      return existingJob.id
    }
    
    // Create new job record
    const { data: newJob } = await supabase
      .from('scheduled_jobs')
      .insert({
        job_name: 'fetch-oil-prices',
        description: 'Fetches oil prices from OilPriceAPI and MarketStack',
        job_type: 'oil_price_fetch',
        cron_expression: '0 8 */13 * * *',
        interval_hours: 13,
        timezone: 'Asia/Dubai',
        is_active: true,
      })
      .select('id')
      .single()
    
    return newJob?.id || null
  } catch (error) {
    console.error('[Cron/FetchPrices] Failed to get job record:', error)
    return null
  }
}

/**
 * GET /api/cron/fetch-prices
 * Fetches oil prices from external APIs
 */
export async function GET(request: NextRequest) {
  console.log('[Cron/FetchPrices] Starting oil price fetch...')
  
  // Validate authorization
  if (!validateCronRequest(request)) {
    console.warn('[Cron/FetchPrices] Unauthorized request')
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const startTime = Date.now()
  
  try {
    const oilPriceService = getOilPriceService()
    
    // Check if we should fetch (13-hour interval)
    const shouldFetch = await oilPriceService.shouldFetch()
    
    if (!shouldFetch) {
      console.log('[Cron/FetchPrices] Skipping - not enough time since last fetch')
      return NextResponse.json({
        success: true,
        message: 'Skipped - not enough time since last fetch',
        skipped: true,
      })
    }
    
    // Fetch oil prices
    const result = await oilPriceService.fetchPrices()
    
    // Get job ID for logging
    const jobId = await getJobRecord()
    
    if (result.success) {
      console.log('[Cron/FetchPrices] Successfully fetched oil prices')
      
      // Log successful execution
      if (jobId) {
        await logJobExecution(
          jobId,
          'success',
          Date.now() - startTime,
          {
            market_trend: result.data?.market_trend,
            brent_price: result.data?.brent_price,
            wti_price: result.data?.wti_price,
          }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: 'Oil prices fetched successfully',
        data: {
          brent_price: result.data?.brent_price,
          wti_price: result.data?.wti_price,
          market_trend: result.data?.market_trend,
          fetched_at: result.data?.fetched_at,
        },
        duration_ms: Date.now() - startTime,
      })
    } else {
      console.error('[Cron/FetchPrices] Fetch failed:', result.error)
      
      // Log failed execution
      if (jobId) {
        await logJobExecution(
          jobId,
          'error',
          Date.now() - startTime,
          undefined,
          result.error || 'Unknown error'
        )
      }
      
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to fetch oil prices',
        duration_ms: Date.now() - startTime,
      }, { status: 500 })
    }
  } catch (error) {
    console.error('[Cron/FetchPrices] Exception:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      duration_ms: Date.now() - startTime,
    }, { status: 500 })
  }
}

// Vercel cron config
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds timeout
