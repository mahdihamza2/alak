/**
 * News Service
 * 
 * Enterprise-grade service for fetching and managing industry news from NewsData.io
 * 
 * Features:
 * - 13-hour fetch interval (as specified)
 * - Dubai timezone (Asia/Dubai) scheduling
 * - Relevance scoring for oil & gas industry
 * - Sentiment analysis
 * - Automatic category mapping
 * - Narrative generation for blog posts
 * 
 * @module NewsService
 */

import { createClient } from '@/lib/supabase/server'
import type {
  NewsArticle,
  NewsArticleInsert,
  BlogCategory,
  NewsSentiment
} from '@/lib/supabase/database.types'

// ============================================================================
// Type Definitions
// ============================================================================

/** NewsData.io API Response Types */
interface NewsDataArticle {
  article_id: string
  title: string
  link: string
  keywords: string[] | null
  creator: string[] | null
  video_url: string | null
  description: string | null
  content: string | null
  pubDate: string
  image_url: string | null
  source_id: string
  source_priority: number
  source_name: string
  source_icon: string | null
  source_url: string
  country: string[]
  category: string[]
  language: string
  ai_tag: string[]
  sentiment: string
  sentiment_stats: string
  ai_region: string
  ai_org: string
  duplicate: boolean
}

interface NewsDataResponse {
  status: string
  totalResults: number
  results: NewsDataArticle[]
  nextPage: string | null
}

/** Relevance Keywords for Oil & Gas Industry */
const RELEVANCE_KEYWORDS = {
  high: [
    'crude oil', 'brent', 'wti', 'opec', 'oil price',
    'petroleum', 'natural gas', 'lng', 'lpg', 'refinery',
    'oil production', 'oil supply', 'oil demand', 'energy sector',
    'oil drilling', 'offshore drilling', 'oil reserves',
    'bonny light', 'dubai crude', 'murban', 'fuel prices',
    'gasoline', 'diesel', 'jet fuel', 'petrochemical',
    'oil trading', 'energy market', 'oil futures', 'commodity',
  ],
  medium: [
    'energy', 'saudi arabia', 'russia oil', 'middle east oil',
    'nigeria oil', 'uae oil', 'iraq oil', 'iran oil',
    'oil company', 'exxon', 'chevron', 'shell', 'bp',
    'totalenergies', 'eni', 'equinor', 'conocophillips',
    'pipeline', 'oil tanker', 'shipping', 'trade',
    'sanctions', 'carbon', 'emissions', 'climate energy',
  ],
  low: [
    'investment', 'stock market', 'economy', 'inflation',
    'dollar', 'currency', 'trade war', 'geopolitical',
    'regulation', 'government', 'policy', 'minister',
  ],
}

/** Category Mapping for News */
const CATEGORY_MAPPING: Record<string, string> = {
  'oil-prices': 'oil-prices',
  'industry-news': 'industry-news',
  'market-analysis': 'market-analysis',
  'geopolitics': 'geopolitics',
  'sustainability': 'sustainability',
  'company-insights': 'company-insights',
}

/** Service Configuration */
interface NewsServiceConfig {
  newsDataApiKey?: string
  timezone: string
  fetchIntervalHours: number
  maxArticlesPerFetch: number
}

/** Fetch Result */
export interface NewsFetchResult {
  success: boolean
  articles: NewsArticle[]
  total_fetched: number
  total_relevant: number
  error: string | null
  duration_ms: number
}

// ============================================================================
// Constants
// ============================================================================

const DUBAI_TIMEZONE = 'Asia/Dubai'
const FETCH_INTERVAL_HOURS = 13
const NEWSDATA_ENDPOINT = 'https://newsdata.io/api/1/news'
const MAX_ARTICLES_PER_FETCH = 50

// ============================================================================
// Service Class
// ============================================================================

export class NewsService {
  private config: NewsServiceConfig
  private categories: BlogCategory[] = []

  constructor(config?: Partial<NewsServiceConfig>) {
    this.config = {
      newsDataApiKey: process.env.NEWSDATA_API_KEY,
      timezone: config?.timezone || DUBAI_TIMEZONE,
      fetchIntervalHours: config?.fetchIntervalHours || FETCH_INTERVAL_HOURS,
      maxArticlesPerFetch: config?.maxArticlesPerFetch || MAX_ARTICLES_PER_FETCH,
    }
  }

  /**
   * Initialize categories from database
   */
  private async loadCategories(): Promise<void> {
    if (this.categories.length > 0) return

    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('is_active', true)

      if (!error && data) {
        this.categories = data
      }
    } catch (error) {
      console.error('[NewsService] Failed to load categories:', error)
    }
  }

  /**
   * Fetch news from NewsData.io
   */
  async fetchNews(): Promise<NewsFetchResult> {
    const startTime = Date.now()
    
    try {
      // Load categories
      await this.loadCategories()
      
      // Fetch news from API
      const newsDataArticles = await this.fetchFromNewsData()
      
      if (!newsDataArticles.length) {
        return {
          success: true,
          articles: [],
          total_fetched: 0,
          total_relevant: 0,
          error: null,
          duration_ms: Date.now() - startTime,
        }
      }

      // Process and score articles
      const processedArticles: Omit<NewsArticle, 'id' | 'created_at'>[] = []
      
      for (const article of newsDataArticles) {
        const processed = await this.processArticle(article)
        if (processed) {
          processedArticles.push(processed)
        }
      }

      // Filter for relevance
      const relevantArticles = processedArticles.filter(
        a => (a.relevance_score ?? 0) >= 30
      )

      // Save to database
      const savedArticles: NewsArticle[] = []
      for (const article of relevantArticles) {
        const saved = await this.saveArticle(article)
        if (saved) {
          savedArticles.push(saved)
        }
      }

      return {
        success: true,
        articles: savedArticles,
        total_fetched: newsDataArticles.length,
        total_relevant: savedArticles.length,
        error: null,
        duration_ms: Date.now() - startTime,
      }
    } catch (error) {
      console.error('[NewsService] Fetch error:', error)
      return {
        success: false,
        articles: [],
        total_fetched: 0,
        total_relevant: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration_ms: Date.now() - startTime,
      }
    }
  }

  /**
   * Fetch from NewsData.io API
   */
  private async fetchFromNewsData(): Promise<NewsDataArticle[]> {
    if (!this.config.newsDataApiKey) {
      console.warn('[NewsService] NewsData API key not configured')
      return []
    }

    try {
      // Build query with oil & gas related keywords
      const keywords = [
        'oil', 'crude', 'petroleum', 'natural gas',
        'opec', 'energy', 'refinery', 'lng'
      ].join(' OR ')

      const params = new URLSearchParams({
        apikey: this.config.newsDataApiKey,
        q: keywords,
        language: 'en',
        size: this.config.maxArticlesPerFetch.toString(),
        category: 'business,top',
      })

      const response = await fetch(`${NEWSDATA_ENDPOINT}?${params}`, {
        next: { revalidate: 0 },
      })

      if (!response.ok) {
        throw new Error(`NewsData API error: ${response.status}`)
      }

      const data: NewsDataResponse = await response.json()
      
      if (data.status !== 'success') {
        throw new Error('NewsData API returned non-success status')
      }

      return data.results || []
    } catch (error) {
      console.error('[NewsService] NewsData fetch failed:', error)
      return []
    }
  }

  /**
   * Process a single article with relevance scoring
   */
  private async processArticle(article: NewsDataArticle): Promise<Omit<NewsArticle, 'id' | 'created_at'> | null> {
    // Check for duplicates
    const isDuplicate = await this.checkDuplicate(article.article_id)
    if (isDuplicate) {
      return null
    }

    // Calculate relevance score
    const relevanceResult = this.calculateRelevance(article)
    
    // Analyze sentiment
    const sentiment = this.analyzeSentiment(article)
    
    // Map to category
    const targetCategory = this.mapToCategory(article, relevanceResult.keywords)

    // Generate narrative if relevant enough
    let generatedNarrative: string | null = null
    let generatedAnalysis: string | null = null
    
    if (relevanceResult.score >= 50) {
      generatedNarrative = this.generateNarrative(article, sentiment)
      generatedAnalysis = this.generateAnalysis(article, sentiment, relevanceResult.keywords)
    }

    return {
      external_id: article.article_id,
      title: article.title,
      description: article.description,
      content: article.content,
      source_url: article.link,
      source_name: article.source_name,
      source_icon: article.source_icon,
      image_url: article.image_url,
      published_at: article.pubDate,
      fetched_at: new Date().toISOString(),
      language: article.language,
      country: article.country?.[0] || null,
      category: article.category?.[0] || null,
      keywords: article.keywords,
      relevance_score: relevanceResult.score,
      relevance_keywords: relevanceResult.keywords,
      sentiment,
      target_category_id: targetCategory?.id || null,
      auto_post_status: 'pending',
      generated_narrative: generatedNarrative,
      generated_analysis: generatedAnalysis,
      auto_posted_at: null,
      blog_post_id: null,
      review_notes: null,
      reviewed_at: null,
      reviewed_by: null,
    }
  }

  /**
   * Calculate relevance score for an article
   */
  private calculateRelevance(article: NewsDataArticle): { score: number; keywords: string[] } {
    let score = 0
    const foundKeywords: string[] = []

    const textToAnalyze = [
      article.title || '',
      article.description || '',
      article.content || '',
      ...(article.keywords || []),
    ].join(' ').toLowerCase()

    // Check high relevance keywords (10 points each)
    for (const keyword of RELEVANCE_KEYWORDS.high) {
      if (textToAnalyze.includes(keyword.toLowerCase())) {
        score += 10
        foundKeywords.push(keyword)
      }
    }

    // Check medium relevance keywords (5 points each)
    for (const keyword of RELEVANCE_KEYWORDS.medium) {
      if (textToAnalyze.includes(keyword.toLowerCase())) {
        score += 5
        foundKeywords.push(keyword)
      }
    }

    // Check low relevance keywords (2 points each)
    for (const keyword of RELEVANCE_KEYWORDS.low) {
      if (textToAnalyze.includes(keyword.toLowerCase())) {
        score += 2
        foundKeywords.push(keyword)
      }
    }

    // Cap score at 100
    score = Math.min(score, 100)

    return { score, keywords: [...new Set(foundKeywords)] }
  }

  /**
   * Analyze sentiment of article
   */
  private analyzeSentiment(article: NewsDataArticle): NewsSentiment {
    const text = [
      article.title || '',
      article.description || '',
    ].join(' ').toLowerCase()

    // Positive indicators
    const positiveWords = [
      'surge', 'rise', 'gain', 'rally', 'increase', 'growth',
      'bullish', 'optimistic', 'boost', 'record high', 'recovery',
      'strong', 'positive', 'upward', 'climb', 'soar'
    ]

    // Negative indicators
    const negativeWords = [
      'drop', 'fall', 'decline', 'plunge', 'crash', 'slump',
      'bearish', 'pessimistic', 'cut', 'record low', 'crisis',
      'weak', 'negative', 'downward', 'sink', 'tumble'
    ]

    let positiveCount = 0
    let negativeCount = 0

    for (const word of positiveWords) {
      if (text.includes(word)) positiveCount++
    }

    for (const word of negativeWords) {
      if (text.includes(word)) negativeCount++
    }

    if (positiveCount > negativeCount + 1) return 'positive'
    if (negativeCount > positiveCount + 1) return 'negative'
    if (positiveCount > 0 && negativeCount > 0) return 'mixed'
    return 'neutral'
  }

  /**
   * Map article to a blog category
   */
  private mapToCategory(article: NewsDataArticle, keywords: string[]): BlogCategory | null {
    // Price-related news
    if (keywords.some(k => ['oil price', 'brent', 'wti', 'crude oil', 'fuel prices'].includes(k.toLowerCase()))) {
      return this.categories.find(c => c.slug === 'oil-prices') || null
    }

    // Market analysis
    if (keywords.some(k => ['market', 'trading', 'futures', 'commodity'].includes(k.toLowerCase()))) {
      return this.categories.find(c => c.slug === 'market-analysis') || null
    }

    // Geopolitics
    if (keywords.some(k => ['opec', 'sanctions', 'russia', 'middle east', 'iran', 'saudi'].includes(k.toLowerCase()))) {
      return this.categories.find(c => c.slug === 'geopolitics') || null
    }

    // Sustainability
    if (keywords.some(k => ['carbon', 'emissions', 'climate', 'green', 'renewable'].includes(k.toLowerCase()))) {
      return this.categories.find(c => c.slug === 'sustainability') || null
    }

    // Company news
    if (keywords.some(k => ['exxon', 'chevron', 'shell', 'bp', 'total', 'eni'].includes(k.toLowerCase()))) {
      return this.categories.find(c => c.slug === 'company-insights') || null
    }

    // Default to industry news
    return this.categories.find(c => c.slug === 'industry-news') || null
  }

  /**
   * Generate narrative for blog post
   */
  private generateNarrative(article: NewsDataArticle, sentiment: NewsSentiment): string {
    const title = article.title || 'Untitled'
    const description = article.description || ''
    const source = article.source_name || 'Industry Source'

    let intro = ''
    switch (sentiment) {
      case 'positive':
        intro = 'In a positive development for the energy sector,'
        break
      case 'negative':
        intro = 'Facing headwinds in the market,'
        break
      case 'mixed':
        intro = 'In a nuanced development affecting energy markets,'
        break
      default:
        intro = 'In recent developments within the oil and gas industry,'
    }

    return `${intro} ${description}

**Source:** ${source}

This development is significant for stakeholders in the global energy market and may have implications for oil pricing, supply dynamics, and strategic planning in the coming weeks.

*This article was automatically curated from industry news sources. For the full story, please refer to the original source.*`
  }

  /**
   * Generate analysis summary
   */
  private generateAnalysis(
    article: NewsDataArticle,
    sentiment: NewsSentiment,
    keywords: string[]
  ): string {
    const keyTopics = keywords.slice(0, 5).join(', ')
    
    let sentimentStatement = ''
    switch (sentiment) {
      case 'positive':
        sentimentStatement = 'This news is likely to have a positive impact on market sentiment and could support oil prices in the near term.'
        break
      case 'negative':
        sentimentStatement = 'This development may weigh on market sentiment and could introduce downward pressure on prices.'
        break
      case 'mixed':
        sentimentStatement = 'Market participants should monitor this situation closely as it presents both opportunities and risks.'
        break
      default:
        sentimentStatement = 'The market impact of this development remains to be seen as more details emerge.'
    }

    return `**Key Topics:** ${keyTopics}

**Market Implication:** ${sentimentStatement}

**Relevance to Alak Oil & Gas:** This news is relevant to our operations and market positioning in the global oil trading landscape. We continue to monitor such developments to ensure optimal trading strategies and risk management.`
  }

  /**
   * Check if article already exists
   */
  private async checkDuplicate(externalId: string): Promise<boolean> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('news_articles')
        .select('id')
        .eq('external_id', externalId)
        .limit(1)

      return !!data && data.length > 0
    } catch {
      return false
    }
  }

  /**
   * Save article to database
   */
  private async saveArticle(article: Omit<NewsArticle, 'id' | 'created_at'>): Promise<NewsArticle | null> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('news_articles')
        .insert(article as NewsArticleInsert)
        .select()
        .single()

      if (error) {
        console.error('[NewsService] Save article error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('[NewsService] Save article exception:', error)
      return null
    }
  }

  /**
   * Get pending news for review
   */
  async getPendingNews(limit: number = 20): Promise<NewsArticle[]> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('auto_post_status', 'pending')
        .order('relevance_score', { ascending: false })
        .order('fetched_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('[NewsService] Get pending news error:', error)
      return []
    }
  }

  /**
   * Get articles ready for auto-posting (approved and high relevance)
   */
  async getArticlesForAutoPosting(): Promise<NewsArticle[]> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('pending_news_for_review')
        .select('*')
        .eq('auto_post_status', 'approved')
        .eq('can_auto_post', true)
        .is('blog_post_id', null)

      if (error) {
        throw error
      }

      return data as NewsArticle[] || []
    } catch (error) {
      console.error('[NewsService] Get articles for auto-posting error:', error)
      return []
    }
  }

  /**
   * Update article status
   */
  async updateArticleStatus(
    articleId: string,
    status: 'approved' | 'rejected' | 'posted' | 'skipped',
    reviewNotes?: string,
    reviewedBy?: string
  ): Promise<boolean> {
    try {
      const supabase = await createClient()
      
      const updateData: Partial<NewsArticle> = {
        auto_post_status: status,
        reviewed_at: new Date().toISOString(),
      }

      if (reviewNotes) {
        updateData.review_notes = reviewNotes
      }

      if (reviewedBy) {
        updateData.reviewed_by = reviewedBy
      }

      if (status === 'posted') {
        updateData.auto_posted_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('news_articles')
        .update(updateData)
        .eq('id', articleId)

      return !error
    } catch (error) {
      console.error('[NewsService] Update article status error:', error)
      return false
    }
  }

  /**
   * Link article to blog post
   */
  async linkToBlogPost(articleId: string, blogPostId: string): Promise<boolean> {
    try {
      const supabase = await createClient()
      
      const { error } = await supabase
        .from('news_articles')
        .update({
          blog_post_id: blogPostId,
          auto_post_status: 'posted',
          auto_posted_at: new Date().toISOString(),
        })
        .eq('id', articleId)

      return !error
    } catch (error) {
      console.error('[NewsService] Link to blog post error:', error)
      return false
    }
  }

  /**
   * Check if news should be fetched based on interval
   */
  async shouldFetch(): Promise<boolean> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('news_articles')
        .select('fetched_at')
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        return true
      }

      const lastFetch = new Date(data.fetched_at)
      const hoursSinceLastFetch = (Date.now() - lastFetch.getTime()) / (1000 * 60 * 60)
      
      return hoursSinceLastFetch >= this.config.fetchIntervalHours
    } catch {
      return true
    }
  }

  /**
   * Get news statistics
   */
  async getStatistics(): Promise<{
    total: number
    pending: number
    approved: number
    posted: number
    rejected: number
    avgRelevance: number
  }> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('news_articles')
        .select('auto_post_status, relevance_score')

      if (error || !data) {
        return {
          total: 0,
          pending: 0,
          approved: 0,
          posted: 0,
          rejected: 0,
          avgRelevance: 0,
        }
      }

      const total = data.length
      const pending = data.filter(a => a.auto_post_status === 'pending').length
      const approved = data.filter(a => a.auto_post_status === 'approved').length
      const posted = data.filter(a => a.auto_post_status === 'posted').length
      const rejected = data.filter(a => a.auto_post_status === 'rejected').length
      
      const avgRelevance = total > 0
        ? data.reduce((sum, a) => sum + (a.relevance_score || 0), 0) / total
        : 0

      return {
        total,
        pending,
        approved,
        posted,
        rejected,
        avgRelevance: Math.round(avgRelevance),
      }
    } catch (error) {
      console.error('[NewsService] Get statistics error:', error)
      return {
        total: 0,
        pending: 0,
        approved: 0,
        posted: 0,
        rejected: 0,
        avgRelevance: 0,
      }
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let newsServiceInstance: NewsService | null = null

export function getNewsService(): NewsService {
  if (!newsServiceInstance) {
    newsServiceInstance = new NewsService()
  }
  return newsServiceInstance
}

export default NewsService
