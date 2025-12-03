/**
 * Cron API Route: Fetch Industry News
 * 
 * Automated endpoint for fetching oil & gas industry news from NewsData.io.
 * Called by Vercel Cron every 13 hours.
 * 
 * Security:
 * - Validates CRON_SECRET header for authorized access
 * - Rate limited to prevent abuse
 * - Logs all execution attempts
 * 
 * @route GET /api/cron/fetch-news
 */

import { NextRequest, NextResponse } from 'next/server'
import { getNewsService } from '@/lib/services'
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
  articlesFetched: number,
  articlesRelevant: number,
  durationMs: number,
  errorMessage?: string
): Promise<void> {
  try {
    const supabase = await createClient()
    
    await supabase.from('job_execution_logs').insert({
      job_id: jobId,
      job_name: 'fetch-industry-news',
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      status,
      duration_ms: durationMs,
      articles_fetched: articlesFetched,
      articles_relevant: articlesRelevant,
      error_message: errorMessage,
      triggered_by: 'cron',
    })
  } catch (error) {
    console.error('[Cron/FetchNews] Failed to log execution:', error)
  }
}

/**
 * Get or create the fetch-news job record
 */
async function getJobRecord(): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    // Find existing job
    const { data: existingJob } = await supabase
      .from('scheduled_jobs')
      .select('id')
      .eq('job_name', 'fetch-industry-news')
      .single()
    
    if (existingJob) {
      return existingJob.id
    }
    
    // Create new job record
    const { data: newJob } = await supabase
      .from('scheduled_jobs')
      .insert({
        job_name: 'fetch-industry-news',
        description: 'Fetches oil & gas industry news from NewsData.io',
        job_type: 'news_fetch',
        cron_expression: '30 8 */13 * * *',
        interval_hours: 13,
        timezone: 'Asia/Dubai',
        is_active: true,
      })
      .select('id')
      .single()
    
    return newJob?.id || null
  } catch (error) {
    console.error('[Cron/FetchNews] Failed to get job record:', error)
    return null
  }
}

/**
 * GET /api/cron/fetch-news
 * Fetches industry news from NewsData.io
 */
export async function GET(request: NextRequest) {
  console.log('[Cron/FetchNews] Starting news fetch...')
  
  // Validate authorization
  if (!validateCronRequest(request)) {
    console.warn('[Cron/FetchNews] Unauthorized request')
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const startTime = Date.now()
  
  try {
    const newsService = getNewsService()
    
    // Check if we should fetch (13-hour interval)
    const shouldFetch = await newsService.shouldFetch()
    
    if (!shouldFetch) {
      console.log('[Cron/FetchNews] Skipping - not enough time since last fetch')
      return NextResponse.json({
        success: true,
        message: 'Skipped - not enough time since last fetch',
        skipped: true,
      })
    }
    
    // Fetch news
    const result = await newsService.fetchNews()
    
    // Get job ID for logging
    const jobId = await getJobRecord()
    
    if (result.success) {
      console.log('[Cron/FetchNews] Successfully fetched news articles')
      
      // Log successful execution
      if (jobId) {
        await logJobExecution(
          jobId,
          'success',
          result.total_fetched,
          result.total_relevant,
          result.duration_ms
        )
      }
      
      return NextResponse.json({
        success: true,
        message: 'News fetched successfully',
        data: {
          total_fetched: result.total_fetched,
          total_relevant: result.total_relevant,
          articles_saved: result.articles.length,
        },
        duration_ms: result.duration_ms,
      })
    } else {
      console.error('[Cron/FetchNews] Fetch failed:', result.error)
      
      // Log failed execution
      if (jobId) {
        await logJobExecution(
          jobId,
          'error',
          0,
          0,
          result.duration_ms,
          result.error || 'Unknown error'
        )
      }
      
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to fetch news',
        duration_ms: result.duration_ms,
      }, { status: 500 })
    }
  } catch (error) {
    console.error('[Cron/FetchNews] Exception:', error)
    
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
