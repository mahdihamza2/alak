/**
 * Services Index
 * 
 * Central export point for all service modules
 * 
 * @module services
 */

// Oil Price Service
export {
  OilPriceService,
  getOilPriceService,
  type OilPriceData,
  type OilPriceFetchResult,
} from './oil-price.service'

// News Service
export {
  NewsService,
  getNewsService,
  type NewsFetchResult,
} from './news.service'

// Blog Generator Service
export {
  BlogGeneratorService,
  getBlogGeneratorService,
  type GeneratedBlogPost,
  type BlogGenerationResult,
} from './blog-generator.service'
