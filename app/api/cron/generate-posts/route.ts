/**
 * Cron API Route: Generate Blog Posts
 * 
 * Automated endpoint for generating blog posts from:
 * - Unposted oil price data (daily price narratives)
 * - Approved news articles (industry news narratives)
 * 
 * Called by Vercel Cron every 13 hours (after price and news fetches).
 * 
 * Security:
 * - Validates CRON_SECRET header for authorized access
 * - Rate limited to prevent abuse
 * - Logs all execution attempts
 * 
 * @route GET /api/cron/generate-posts
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBlogGeneratorService, getNewsService } from '@/lib/services'
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
  postsCreated: number,
  postsPublished: number,
  errorMessage?: string
): Promise<void> {
  try {
    const supabase = await createClient()
    
    await supabase.from('job_execution_logs').insert({
      job_id: jobId,
      job_name: 'generate-blog-posts',
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      status,
      duration_ms: durationMs,
      posts_created: postsCreated,
      posts_published: postsPublished,
      error_message: errorMessage,
      triggered_by: 'cron',
    })
  } catch (error) {
    console.error('[Cron/GeneratePosts] Failed to log execution:', error)
  }
}

/**
 * Get or create the generate-posts job record
 */
async function getJobRecord(): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    // Find existing job
    const { data: existingJob } = await supabase
      .from('scheduled_jobs')
      .select('id')
      .eq('job_name', 'generate-blog-posts')
      .single()
    
    if (existingJob) {
      return existingJob.id
    }
    
    // Create new job record
    const { data: newJob } = await supabase
      .from('scheduled_jobs')
      .insert({
        job_name: 'generate-blog-posts',
        description: 'Generates blog posts from oil prices and approved news',
        job_type: 'blog_generation',
        cron_expression: '0 9 */13 * * *',
        interval_hours: 13,
        timezone: 'Asia/Dubai',
        is_active: true,
      })
      .select('id')
      .single()
    
    return newJob?.id || null
  } catch (error) {
    console.error('[Cron/GeneratePosts] Failed to get job record:', error)
    return null
  }
}

/**
 * GET /api/cron/generate-posts
 * Generates blog posts from oil prices and approved news
 */
export async function GET(request: NextRequest) {
  console.log('[Cron/GeneratePosts] Starting blog post generation...')
  
  // Validate authorization
  if (!validateCronRequest(request)) {
    console.warn('[Cron/GeneratePosts] Unauthorized request')
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const startTime = Date.now()
  const results = {
    pricePostsGenerated: 0,
    newsPostsGenerated: 0,
    priceErrors: 0,
    newsErrors: 0,
    totalPosts: 0,
  }
  
  try {
    const blogGenerator = getBlogGeneratorService()
    const newsService = getNewsService()
    
    // 1. Generate posts from unposted oil prices
    console.log('[Cron/GeneratePosts] Processing unposted oil prices...')
    
    const unpostedPrices = await blogGenerator.getUnpostedPrices()
    console.log(`[Cron/GeneratePosts] Found ${unpostedPrices.length} unposted oil prices`)
    
    for (const priceData of unpostedPrices) {
      try {
        const result = await blogGenerator.generateFromOilPrice(priceData)
        
        if (result.success && result.post) {
          results.pricePostsGenerated++
          console.log(`[Cron/GeneratePosts] Generated price post: ${result.post.title}`)
        } else {
          results.priceErrors++
          console.error(`[Cron/GeneratePosts] Failed to generate price post: ${result.error}`)
        }
      } catch (error) {
        results.priceErrors++
        console.error('[Cron/GeneratePosts] Price post generation error:', error)
      }
    }
    
    // 2. Generate posts from approved news articles
    console.log('[Cron/GeneratePosts] Processing approved news articles...')
    
    const approvedArticles = await newsService.getArticlesForAutoPosting()
    console.log(`[Cron/GeneratePosts] Found ${approvedArticles.length} approved news articles`)
    
    for (const article of approvedArticles) {
      try {
        const result = await blogGenerator.generateFromNews(article)
        
        if (result.success && result.post) {
          results.newsPostsGenerated++
          console.log(`[Cron/GeneratePosts] Generated news post: ${result.post.title}`)
        } else {
          results.newsErrors++
          console.error(`[Cron/GeneratePosts] Failed to generate news post: ${result.error}`)
        }
      } catch (error) {
        results.newsErrors++
        console.error('[Cron/GeneratePosts] News post generation error:', error)
      }
    }
    
    // Calculate totals
    results.totalPosts = results.pricePostsGenerated + results.newsPostsGenerated
    const totalErrors = results.priceErrors + results.newsErrors
    
    // Get job ID for logging
    const jobId = await getJobRecord()
    
    // Log execution
    if (jobId) {
      const status = totalErrors === 0 ? 'success' : 'error'
      await logJobExecution(
        jobId,
        status,
        Date.now() - startTime,
        results.totalPosts,
        results.totalPosts,
        totalErrors > 0 ? `${totalErrors} posts failed to generate` : undefined
      )
    }
    
    console.log('[Cron/GeneratePosts] Generation complete:', results)
    
    return NextResponse.json({
      success: true,
      message: `Generated ${results.totalPosts} blog posts`,
      data: results,
      duration_ms: Date.now() - startTime,
    })
    
  } catch (error) {
    console.error('[Cron/GeneratePosts] Exception:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Get job ID for logging
    const jobId = await getJobRecord()
    if (jobId) {
      await logJobExecution(
        jobId,
        'error',
        Date.now() - startTime,
        0,
        0,
        errorMessage
      )
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      data: results,
      duration_ms: Date.now() - startTime,
    }, { status: 500 })
  }
}

// Vercel cron config
export const dynamic = 'force-dynamic'
export const maxDuration = 120 // 2 minutes timeout for generation
