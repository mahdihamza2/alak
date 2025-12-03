/**
 * Blog Generator Service
 * 
 * Enterprise-grade service for automatically generating blog posts from:
 * - Oil price data (daily price narratives)
 * - News articles (industry news narratives)
 * 
 * Features:
 * - Template-based content generation
 * - Market trend-aware narratives
 * - Sentiment-based introductions
 * - SEO-optimized content structure
 * - Automatic slug generation
 * - Dubai timezone scheduling
 * 
 * @module BlogGeneratorService
 */

import { createClient } from '@/lib/supabase/server'
import type {
  BlogPost,
  BlogPostInsert,
  BlogCategory,
  BlogPostTemplate,
  OilPrice,
  NewsArticle,
  MarketTrend,
} from '@/lib/supabase/database.types'

// ============================================================================
// Type Definitions
// ============================================================================

/** Generated Blog Post Data */
export interface GeneratedBlogPost {
  title: string
  slug: string
  content: string
  excerpt: string
  meta_title: string
  meta_description: string
  category_id: string
  tags: string[]
  author_name: string
  author_role: string
  is_auto_generated: boolean
  auto_source: 'oil_price' | 'news_article'
  source_reference_id: string
  analysis_summary: string | null
  market_outlook: string | null
  key_factors: string[]
  featured_image?: string
  featured_image_alt?: string
}

/** Service Configuration */
interface BlogGeneratorConfig {
  timezone: string
  defaultAuthorName: string
  defaultAuthorRole: string
}

/** Generation Result */
export interface BlogGenerationResult {
  success: boolean
  post: BlogPost | null
  error: string | null
}

// ============================================================================
// Constants
// ============================================================================

const DUBAI_TIMEZONE = 'Asia/Dubai'

const DEFAULT_CONFIG: BlogGeneratorConfig = {
  timezone: DUBAI_TIMEZONE,
  defaultAuthorName: 'Alak Market Intelligence',
  defaultAuthorRole: 'Market Analysis Team',
}

// Month names for formatting
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// ============================================================================
// Service Class
// ============================================================================

export class BlogGeneratorService {
  private config: BlogGeneratorConfig
  private templates: Map<string, BlogPostTemplate> = new Map()
  private categories: Map<string, BlogCategory> = new Map()

  constructor(config?: Partial<BlogGeneratorConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Initialize templates and categories from database
   */
  private async initialize(): Promise<void> {
    if (this.templates.size > 0 && this.categories.size > 0) return

    try {
      const supabase = await createClient()
      
      // Load templates
      const { data: templates } = await supabase
        .from('blog_post_templates')
        .select('*')
        .eq('is_active', true)

      if (templates) {
        for (const template of templates) {
          this.templates.set(template.template_type, template)
        }
      }

      // Load categories
      const { data: categories } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('is_active', true)

      if (categories) {
        for (const category of categories) {
          this.categories.set(category.slug, category)
        }
      }
    } catch (error) {
      console.error('[BlogGeneratorService] Initialization error:', error)
    }
  }

  /**
   * Generate blog post from oil price data
   */
  async generateFromOilPrice(priceData: OilPrice): Promise<BlogGenerationResult> {
    try {
      await this.initialize()

      const template = this.templates.get('daily_price_narrative')
      const category = this.categories.get('oil-prices')

      if (!category) {
        throw new Error('Oil prices category not found')
      }

      // Format date for title
      const priceDate = new Date(priceData.price_date)
      const formattedDate = this.formatDateForTitle(priceDate)

      // Determine market trend intro
      const trendIntro = this.getTrendIntro(priceData.market_trend as MarketTrend, template)

      // Generate title
      const title = this.generatePriceTitle(priceData, formattedDate)

      // Generate slug
      const slug = await this.generateSlug(title)

      // Generate content
      const content = this.generatePriceContent(priceData, trendIntro, formattedDate)

      // Generate excerpt
      const excerpt = this.generatePriceExcerpt(priceData, formattedDate)

      // Generate meta tags
      const metaTitle = `${title} | Alak Oil & Gas`
      const metaDescription = excerpt.substring(0, 155) + '...'

      // Generate analysis
      const analysis = this.generatePriceAnalysis(priceData)
      const outlook = this.generateMarketOutlook(priceData)

      // Prepare tags
      const tags = this.generatePriceTags(priceData)

      // Create blog post
      const blogPostData: BlogPostInsert = {
        title,
        slug,
        content,
        excerpt,
        meta_title: metaTitle,
        meta_description: metaDescription,
        category_id: category.id,
        tags,
        author_name: template?.default_author_name || this.config.defaultAuthorName,
        author_role: this.config.defaultAuthorRole,
        is_auto_generated: true,
        auto_source: 'oil_price',
        source_reference_id: priceData.id,
        analysis_summary: analysis,
        market_outlook: outlook,
        key_factors: priceData.trend_factors || [],
        status: 'published',
        published_at: new Date().toISOString(),
      }

      const supabase = await createClient()
      const { data: post, error } = await supabase
        .from('blog_posts')
        .insert(blogPostData)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update oil_prices to link to blog post
      await supabase
        .from('oil_prices')
        .update({
          auto_posted: true,
          auto_posted_at: new Date().toISOString(),
          auto_post_id: post.id,
        })
        .eq('id', priceData.id)

      return {
        success: true,
        post,
        error: null,
      }
    } catch (error) {
      console.error('[BlogGeneratorService] Generate from oil price error:', error)
      return {
        success: false,
        post: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Generate blog post from news article
   */
  async generateFromNews(article: NewsArticle): Promise<BlogGenerationResult> {
    try {
      await this.initialize()

      const template = this.templates.get('news_narrative')
      const category = article.target_category_id
        ? Array.from(this.categories.values()).find(c => c.id === article.target_category_id)
        : this.categories.get('industry-news')

      if (!category) {
        throw new Error('Target category not found')
      }

      // Generate title (enhance original if needed)
      const title = this.enhanceNewsTitle(article.title)

      // Generate slug
      const slug = await this.generateSlug(title)

      // Generate content
      const content = this.generateNewsContent(article)

      // Generate excerpt
      const excerpt = article.description || article.generated_narrative?.substring(0, 200) || ''

      // Generate meta tags
      const metaTitle = `${title} | Alak Oil & Gas Insights`
      const metaDescription = excerpt.substring(0, 155) + '...'

      // Prepare tags
      const tags = this.generateNewsTags(article)

      // Create blog post
      const blogPostData: BlogPostInsert = {
        title,
        slug,
        content,
        excerpt,
        meta_title: metaTitle,
        meta_description: metaDescription,
        category_id: category.id,
        tags,
        author_name: template?.default_author_name || this.config.defaultAuthorName,
        author_role: this.config.defaultAuthorRole,
        is_auto_generated: true,
        auto_source: 'news_article',
        source_reference_id: article.id,
        analysis_summary: article.generated_analysis,
        featured_image: article.image_url,
        featured_image_alt: article.title,
        status: 'published',
        published_at: new Date().toISOString(),
      }

      const supabase = await createClient()
      const { data: post, error } = await supabase
        .from('blog_posts')
        .insert(blogPostData)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update news_articles to link to blog post
      await supabase
        .from('news_articles')
        .update({
          auto_post_status: 'posted',
          auto_posted_at: new Date().toISOString(),
          blog_post_id: post.id,
        })
        .eq('id', article.id)

      return {
        success: true,
        post,
        error: null,
      }
    } catch (error) {
      console.error('[BlogGeneratorService] Generate from news error:', error)
      return {
        success: false,
        post: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Generate unique slug for blog post
   */
  private async generateSlug(title: string): Promise<string> {
    const supabase = await createClient()
    
    // Generate base slug from title
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100)

    // Check for uniqueness
    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .limit(1)

      if (!data || data.length === 0) {
        break
      }

      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }

  /**
   * Get trend-based introduction
   */
  private getTrendIntro(trend: MarketTrend, template: BlogPostTemplate | undefined): string {
    if (!template) {
      return this.getDefaultTrendIntro(trend)
    }

    switch (trend) {
      case 'bullish':
        return template.bullish_intro || this.getDefaultTrendIntro(trend)
      case 'bearish':
        return template.bearish_intro || this.getDefaultTrendIntro(trend)
      case 'volatile':
        return template.volatile_intro || this.getDefaultTrendIntro(trend)
      default:
        return template.neutral_intro || this.getDefaultTrendIntro(trend)
    }
  }

  /**
   * Default trend introductions
   */
  private getDefaultTrendIntro(trend: MarketTrend): string {
    switch (trend) {
      case 'bullish':
        return 'Oil markets opened with strong upward momentum today, as key benchmarks posted significant gains amid supportive fundamentals.'
      case 'bearish':
        return 'Energy markets faced headwinds in today\'s trading session, with crude oil benchmarks retreating on broader market concerns.'
      case 'volatile':
        return 'Markets exhibited heightened volatility in today\'s session, with oil prices swinging in response to mixed signals from supply and demand indicators.'
      default:
        return 'Oil markets traded within a narrow range today, as traders weighed competing factors in a balanced session.'
    }
  }

  /**
   * Generate title for price post
   */
  private generatePriceTitle(priceData: OilPrice, formattedDate: string): string {
    const brentChange = priceData.brent_change_percent || 0
    
    if (Math.abs(brentChange) > 3) {
      const direction = brentChange > 0 ? 'Surge' : 'Drop'
      return `Oil Prices ${direction} as Brent Moves ${Math.abs(brentChange).toFixed(1)}% - ${formattedDate}`
    } else if (Math.abs(brentChange) > 1) {
      const direction = brentChange > 0 ? 'Rise' : 'Decline'
      return `Oil Markets ${direction}: Daily Price Update - ${formattedDate}`
    } else {
      return `Oil Market Recap: Prices Hold Steady - ${formattedDate}`
    }
  }

  /**
   * Generate content for price post
   */
  private generatePriceContent(priceData: OilPrice, trendIntro: string, formattedDate: string): string {
    const brentPrice = priceData.brent_price?.toFixed(2) || 'N/A'
    const wtiPrice = priceData.wti_price?.toFixed(2) || 'N/A'
    const dubaiPrice = priceData.dubai_crude_price?.toFixed(2) || 'N/A'
    const bonnyPrice = priceData.bonny_light_price?.toFixed(2) || 'N/A'
    const natGasPrice = priceData.natural_gas_price?.toFixed(2) || 'N/A'

    const brentChangeStr = this.formatChange(priceData.brent_change, priceData.brent_change_percent)
    const wtiChangeStr = this.formatChange(priceData.wti_change, priceData.wti_change_percent)

    return `
## Market Overview

${trendIntro}

## Key Benchmark Prices

| Crude Grade | Price (USD/bbl) | Change |
|-------------|-----------------|--------|
| Brent Crude | $${brentPrice} | ${brentChangeStr} |
| WTI Crude | $${wtiPrice} | ${wtiChangeStr} |
| Dubai Crude | $${dubaiPrice} | ${this.formatChange(priceData.dubai_crude_change, priceData.dubai_crude_change_percent)} |
| Bonny Light | $${bonnyPrice} | ${this.formatChange(priceData.bonny_light_change, priceData.bonny_light_change_percent)} |
| Natural Gas | $${natGasPrice}/MMBtu | ${this.formatChange(priceData.natural_gas_change, priceData.natural_gas_change_percent)} |

## Market Analysis

${this.generatePriceAnalysis(priceData)}

## Market Outlook

${this.generateMarketOutlook(priceData)}

## Key Factors to Watch

${(priceData.trend_factors || []).map(factor => `- ${factor}`).join('\n')}

---

*This market update is provided by Alak Oil & Gas Market Intelligence Team. Prices are indicative and subject to change. Last updated: ${formattedDate}*

*For trading inquiries, please [contact our team](/contact).*
`
  }

  /**
   * Generate excerpt for price post
   */
  private generatePriceExcerpt(priceData: OilPrice, formattedDate: string): string {
    const brentPrice = priceData.brent_price?.toFixed(2) || 'N/A'
    const brentChangeStr = this.formatChange(priceData.brent_change, priceData.brent_change_percent)
    
    return `${formattedDate} - Brent crude trading at $${brentPrice}/bbl (${brentChangeStr}). Get the full market analysis and key benchmark prices in our daily oil market update.`
  }

  /**
   * Generate analysis from price data
   */
  private generatePriceAnalysis(priceData: OilPrice): string {
    const trend = priceData.market_trend as MarketTrend
    const brentChange = priceData.brent_change_percent || 0

    let analysis = ''

    if (trend === 'bullish') {
      analysis = `Today's trading session reflected **bullish sentiment** across oil markets, with key benchmarks posting gains. The upward movement suggests continued optimism about demand fundamentals and supply dynamics.`
    } else if (trend === 'bearish') {
      analysis = `Markets displayed **bearish characteristics** in today's session, with prices retreating from recent levels. Traders appear to be reassessing near-term demand projections amid broader economic considerations.`
    } else if (trend === 'volatile') {
      analysis = `**Volatility** characterized today's trading, as markets reacted to competing signals. The mixed session suggests uncertainty about near-term direction as traders await clarity on key market drivers.`
    } else {
      analysis = `Markets traded in a **neutral range** today, with prices showing limited movement. The balanced session indicates a wait-and-see approach as traders assess the evolving supply-demand landscape.`
    }

    if (Math.abs(brentChange) > 2) {
      analysis += ` The ${brentChange > 0 ? 'significant gains' : 'notable decline'} in Brent crude warrants attention from market participants.`
    }

    return analysis
  }

  /**
   * Generate market outlook
   */
  private generateMarketOutlook(priceData: OilPrice): string {
    const trend = priceData.market_trend as MarketTrend

    let outlook = 'Looking ahead, market participants should monitor:\n\n'
    
    if (trend === 'bullish') {
      outlook += '- **OPEC+ compliance levels** and any signals regarding production policy\n'
      outlook += '- **Demand indicators** from key consuming regions\n'
      outlook += '- **Inventory data** releases for confirmation of current trends\n'
    } else if (trend === 'bearish') {
      outlook += '- **Economic data releases** that may impact demand expectations\n'
      outlook += '- **Production growth** from non-OPEC suppliers\n'
      outlook += '- **Technical support levels** that could provide price floors\n'
    } else {
      outlook += '- **Supply-demand balance** indicators for directional clarity\n'
      outlook += '- **Geopolitical developments** affecting key producing regions\n'
      outlook += '- **Currency movements** that may impact dollar-denominated oil\n'
    }

    return outlook
  }

  /**
   * Generate tags for price post
   */
  private generatePriceTags(priceData: OilPrice): string[] {
    const tags = ['oil prices', 'market update', 'brent crude', 'wti']
    
    if (priceData.market_trend === 'bullish') {
      tags.push('bullish', 'price rally')
    } else if (priceData.market_trend === 'bearish') {
      tags.push('bearish', 'price decline')
    }

    if (priceData.bonny_light_price) {
      tags.push('bonny light', 'nigerian crude')
    }

    if (priceData.dubai_crude_price) {
      tags.push('dubai crude', 'middle east')
    }

    return tags
  }

  /**
   * Enhance news title
   */
  private enhanceNewsTitle(originalTitle: string): string {
    // Clean and enhance the title
    let title = originalTitle
      .replace(/\s+/g, ' ')
      .trim()

    // Add context if title is too short
    if (title.length < 30) {
      title = `Energy Markets: ${title}`
    }

    return title
  }

  /**
   * Generate content for news post
   */
  private generateNewsContent(article: NewsArticle): string {
    const narrative = article.generated_narrative || article.description || ''
    const analysis = article.generated_analysis || ''

    return `
${narrative}

${analysis ? `## Analysis\n\n${analysis}` : ''}

## About This Report

This article has been curated and analyzed by the Alak Oil & Gas Market Intelligence team to provide relevant insights for our stakeholders in the global energy trading sector.

${article.source_url ? `**Original Source:** [${article.source_name || 'Read More'}](${article.source_url})` : ''}

---

*For more industry insights and market analysis, subscribe to our updates or [contact our team](/contact).*
`
  }

  /**
   * Generate tags for news post
   */
  private generateNewsTags(article: NewsArticle): string[] {
    const tags: string[] = ['industry news']
    
    // Add relevance keywords as tags
    if (article.relevance_keywords) {
      tags.push(...article.relevance_keywords.slice(0, 5))
    }

    // Add sentiment tag
    if (article.sentiment) {
      tags.push(article.sentiment)
    }

    // Add source tag
    if (article.source_name) {
      tags.push(article.source_name.toLowerCase().replace(/\s+/g, '-'))
    }

    return [...new Set(tags)]
  }

  /**
   * Format change with sign and percentage
   */
  private formatChange(change: number | null, changePercent: number | null): string {
    if (change === null || changePercent === null) {
      return 'N/A'
    }

    const sign = change >= 0 ? '+' : ''
    return `${sign}$${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`
  }

  /**
   * Format date for title
   */
  private formatDateForTitle(date: Date): string {
    const day = date.getDate()
    const month = MONTH_NAMES[date.getMonth()]
    const year = date.getFullYear()
    
    return `${month} ${day}, ${year}`
  }

  /**
   * Get all published blog posts
   */
  async getPublishedPosts(options: {
    limit?: number
    offset?: number
    categorySlug?: string
  } = {}): Promise<BlogPost[]> {
    try {
      const supabase = await createClient()
      
      let query = supabase
        .from('blog_posts')
        .select('*, blog_categories(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (options.categorySlug) {
        const category = this.categories.get(options.categorySlug)
        if (category) {
          query = query.eq('category_id', category.id)
        }
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('[BlogGeneratorService] Get published posts error:', error)
      return []
    }
  }

  /**
   * Get single blog post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) {
        return null
      }

      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id)

      return data
    } catch (error) {
      console.error('[BlogGeneratorService] Get post by slug error:', error)
      return null
    }
  }

  /**
   * Get unposted oil prices for auto-posting
   */
  async getUnpostedPrices(): Promise<OilPrice[]> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('oil_prices')
        .select('*')
        .eq('auto_posted', false)
        .order('price_date', { ascending: false })
        .limit(5)

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('[BlogGeneratorService] Get unposted prices error:', error)
      return []
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let blogGeneratorInstance: BlogGeneratorService | null = null

export function getBlogGeneratorService(): BlogGeneratorService {
  if (!blogGeneratorInstance) {
    blogGeneratorInstance = new BlogGeneratorService()
  }
  return blogGeneratorInstance
}

export default BlogGeneratorService
